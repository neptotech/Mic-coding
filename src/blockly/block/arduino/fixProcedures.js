const FixProcedure = () => {
  const { Blockly } = window;

  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = '定义函数';

  Blockly.Blocks.procedures_return = {
    /**
     * Block for returning a value from a procedure.
     * @this Blockly.Block
     */
    init() {
      this.appendValueInput('VALUE')
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.hasReturnValue_ = true;
      this.setColour(Blockly.Msg.MicFunHUE);
    },
    /**
     * Called whenever anything on the workspace changes.
     * Add warning if this flow block is not nested inside a loop.
     * @this Blockly.Block
     */
    onchange(event) {
    }
  };

  // 新增的变量
  Blockly.Msg.PROCEDURES_CHANGE_NAME_TITLE = "修改函数名";
  Blockly.Msg.PROCEDURES_NAME_EMPTY_TIPS = "函数名不能为空";
  Blockly.Msg.PROCEDURES_ADD_ARGUMENT_TITLE = "参数名称";
  Blockly.Msg.PROCEDURES_ARGUMENT_EMPTY_TIPS = "参数名不能为空";
  Blockly.Msg.PROCEDURES_ARGUMENT_DUPLICATE_TIPS = "重复的参数名";

  Blockly.Blocks['procedures_defnoreturn'] = {
    /**
     * Block for defining a procedure with no return value.
     * @this Blockly.Block
     */
    init: function () {
      var nameField = new Blockly.FieldTextInput('', Blockly.Procedures.rename);

      function defaultValidate(text) {
        if (text.trim && text.trim().length === 0) {
          return {
            valid: false,
            tips: Blockly.Msg.PROCEDURES_NAME_EMPTY_TIPS
          }
        }
        return {
          valid: true
        }
      }

      const validate = Blockly.Settings.proceduresNameValidate || defaultValidate;
      nameField.setSpellcheck(false);
      const block = this;
      nameField.showEditor_ = function () {
        if (block.isInFlyout) {
          return;
        }
        Blockly.prompt(Blockly.Msg.PROCEDURES_CHANGE_NAME_TITLE, this.text_, (text) => {
          if (this.sourceBlock_) {
            text = this.callValidator(text);
          }
          if (text) {
            this.setValue(text);
          }
        }, {
          validate // 函数名验证
        });
      };

      this.appendDummyInput()
        .appendField(Blockly.Msg['PROCEDURES_DEFNORETURN_TITLE'])
        .appendField(new Blockly.FieldDropdown(Blockly.Types.getValidTypeArray()), 'RETURN_TYPE');

      this.appendDummyInput()
        .appendField(nameField, 'NAME');

      this.setColour(Blockly.Msg['MicFunHUE']);

      this.arguments_ = [];
      this.argumentVarModels_ = [];
      this.updateParams_();
    },
    onchange: function (event) {
      if (Blockly._enable_performance_optimization) {
        return;
      }
      if (this.isInFlyout) {
        return;
      }
      // 添加 this.workspace.isDragging 判断
      // 有的情况下 this.workspace 不存在 isDragging 方法
      if (this.workspace && this.workspace.isDragging && this.workspace.isDragging()) {
        return;
      }
      if (event.type === Blockly.Events.UI) {
        return;
      }

      this.refreshFlyout();
    },
    refreshFlyout: function () {
      // 性能优化，延迟调用
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }
      this.refreshTimer = setTimeout(() => {
        if (this.workspace && this.workspace.toolbox_) {
          this.workspace.toolbox_.refreshSelection();
        }
      }, 100);
    },
    removeMutation: function (e) {
      if (this.isInFlyout) {
        return;
      }
      if (this.arguments_.length) {
        this.arguments_.pop();
        this.argumentVarModels_.pop();
        this.updateShape_();
        Blockly.Procedures.mutateCallers(this);
        this.refreshFlyout();
      }
    },
    addMutation: function (e) {
      if (this.isInFlyout) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      const validate = (argName) => {
        argName = argName.trim();
        if (argName.length === 0) { // 参数名不能为空
          return {
            valid: false,
            tips: Blockly.Msg.PROCEDURES_ARGUMENT_EMPTY_TIPS
          }
        }

        if (this.arguments_.includes(argName)) { // 参数名不能重复
          return {
            valid: false,
            tips: Blockly.Msg.PROCEDURES_ARGUMENT_DUPLICATE_TIPS
          }
        }

        return {
          valid: true
        }
      }

      Blockly.prompt(Blockly.Msg.PROCEDURES_ADD_ARGUMENT_TITLE, '', (argName) => { // 回调函数
        this.arguments_.push(argName);
        this.updateShape_();
        Blockly.Procedures.mutateCallers(this);
        this.refreshFlyout();
      }, {
        validate
      });
    },
    storeConnections_() { // 保存语句输入连接
      this.stackConnection_ = null;
      const stackInput = this.getInput('STACK')
      if (stackInput) {
        this.stackConnection_ = stackInput.connection.targetConnection;
      }
    },
    restoreConnections_: function () {  // 恢复语句输入连接
      if (this.getInput('STACK')) {
        Blockly.Mutator.reconnect(this.stackConnection_, this, 'STACK');
      }
    },
    /**
     * Update the display of parameters for this procedure definition block.
     * Display a warning if there are duplicately named parameters.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
      var savedRendered = this.rendered;
      this.rendered = false;
      this.updateParams_();
      this.rendered = savedRendered;
      this.initSvg();
      if (this.rendered) {
        this.render();
      }
    },
    updateParams_: function () {
      // Check for duplicated arguments. 检查重复参数
      // 当前没有用到，可以注释掉
      var badArg = false;
      var hash = {};
      for (let i = 0; i < this.arguments_.length; i++) {
        if (hash['arg_' + this.arguments_[i].toLowerCase()]) {
          badArg = true;
          break;
        }
        hash['arg_' + this.arguments_[i].toLowerCase()] = true;
      }
      if (badArg) { // 有重复参数
        this.setWarningText(Blockly.Msg['PROCEDURES_DEF_DUPLICATE_WARNING']);
      } else {
        this.setWarningText(null);
      }

      this.storeConnections_();

      if (this.getInput('MUTATE_BTN')) {
        this.removeInput('MUTATE_BTN');
      }

      if (this.getInput('STACK')) {
        this.removeInput('STACK', true);
      }

      if (this.getInput('leftBracket')) {
        this.removeInput('leftBracket');
      }

      if (this.getInput('rightBracket')) {
        this.removeInput('rightBracket');
      }

      let i = 0;
      while (this.getInput(`COMMMA_${i}`)) {
        this.removeInput(`COMMMA_${i}`);
        i++;
      }

      // 参数类型积木删除多余的
      i = 0;
      while (this.getInput(`ARG_TYPE_${i}`)) {
        this.removeInput(`ARG_TYPE_${i}`);
        i++;
      }

      // 参数积木删除多余的
      i = 0;
      while (this.getInput(`ARG_${i}`)) {
        this.removeInput(`ARG_${i}`);
        i++;
      }

      const checkAndOutput = 'procedures_argument';

      // 参数积木补齐
      for (let i = 0; i < this.arguments_.length; i++) {
        if (i === 0) {
          this.appendDummyInput('leftBracket')
            .appendField('(');
        }
        const inputName = `ARG_${i}`;
        const inputTypeName = `ARG_TYPE_${i}`;

        this.appendDummyInput(inputTypeName)
          .appendField(new Blockly.FieldDropdown(
          Blockly.Types.getValidTypeArray()),
          inputTypeName);
        const newInput = this.appendValueInput(inputName);
        newInput.setCheck(checkAndOutput); // 新建的 valueInput check 为特定值，防止其它积木连接

        const argName = this.arguments_[i];
        const shadowBlock = this.workspace.newBlock('procedures_argument');
        shadowBlock.setArgName(argName);
        shadowBlock.setShadow(true);
        shadowBlock.initSvg();
        shadowBlock.render();

        // shadowBlock.setOutput(checkAndOutput); // 新建的 procedures_argument output 为特定值，与上边 valueInput 连接
        const ob = shadowBlock.outputConnection;
        const cc = newInput.connection;
        cc.connect(ob);

        if (i+1 < this.arguments_.length) {
          this.appendDummyInput(`COMMMA_${i}`)
            .appendField(',');
        }        
        
        if ( i === this.arguments_.length - 1) {    
          this.appendDummyInput('rightBracket')
            .appendField(')');
        }
      }

      this.removeParamBtn = new Blockly.FieldButton(
        Blockly.Settings.removeBtnUrl,
        Blockly.Settings.mutateBtnWidth,
        Blockly.Settings.mutateBtnHeight,
        'remove param',
        (e) => { this.removeMutation(e); }
      );

      this.addParamBtn = new Blockly.FieldButton(
        Blockly.Settings.addBtnUrl,
        Blockly.Settings.mutateBtnWidth,
        Blockly.Settings.mutateBtnHeight,
        'add param',
        (e) => { this.addMutation(e); }
      );

      this.appendDummyInput('MUTATE_BTN')
        .appendField(this.removeParamBtn)
        .appendField(this.addParamBtn);

      this.appendStatementInput('STACK');
      this.restoreConnections_();
    },
    /**
     * Create XML to represent the argument inputs.
     * @param {boolean=} opt_paramIds If true include the IDs of the parameter
     *     quarks.  Used by Blockly.Procedures.mutateCallers for reconnection.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function (opt_paramIds) {
      var container = document.createElement('mutation');
      if (opt_paramIds) {
        container.setAttribute('name', this.getFieldValue('NAME'));
      }

      /* for (var i = 0; i < this.argumentVarModels_.length; i++) {
        var parameter = document.createElement('arg');
        var argModel = this.argumentVarModels_[i];
        parameter.setAttribute('name', argModel.name);
        parameter.setAttribute('varid', argModel.getId());
        if (opt_paramIds && this.paramIds_) {
          parameter.setAttribute('paramId', this.paramIds_[i]);
        }
        container.appendChild(parameter);
      } */

      for (var i = 0; i < this.arguments_.length; i++) {
        var parameter = document.createElement('arg');
        var name = this.arguments_[i];
        parameter.setAttribute('name', name);
        // if (opt_paramIds && this.paramIds_) {
        //   parameter.setAttribute('paramId', this.paramIds_[i]);
        // }
        container.appendChild(parameter);
      }
      return container;
    },
    /**
     * Parse XML to restore the argument inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
      this.arguments_ = [];
      this.argumentVarModels_ = [];
      for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
        // 参数
        if (childNode.nodeName.toLowerCase() == 'arg') {
          var argName = childNode.getAttribute('name');
          this.arguments_.push(argName);
        }
      }
      this.updateShape_();
      Blockly.Procedures.mutateCallers(this);

      // Show or hide the statement input. 显示或者隐藏语句输入
      // this.setStatements_(xmlElement.getAttribute('statements') !== 'false');
    },
    /**
     * Return the signature of this procedure definition.
     * @return {!Array} Tuple containing three elements:
     *     - the name of the defined procedure, 函数名
     *     - a list of all its arguments, 参数列表
     *     - that it DOES NOT have a return value. 是否有返回
     * @this Blockly.Block
     */
    getProcedureDef: function () {
      return [this.getFieldValue('NAME'), this.arguments_, false];
    },
    /**
     * Return all variables referenced by this block.
     * @return {!Array.<string>} List of variable names.
     * @this Blockly.Block
     */
    getVars: function () {
      return this.arguments_;
    },
    /**
     * Return all variables referenced by this block.
     * @return {!Array.<!Blockly.VariableModel>} List of variable models.
     * @this Blockly.Block
     */
    // getVarModels: function() {
    //   return this.argumentVarModels_;
    // },
    /**
     * Notification that a variable is renaming.
     * If the ID matches one of this block's variables, rename it.
     * @param {string} oldId ID of variable to rename.
     * @param {string} newId ID of new variable.  May be the same as oldId, but
     *     with an updated name.  Guaranteed to be the same type as the old
     *     variable.
     * @override
     * @this Blockly.Block
     */
    renameVarById: function (oldId, newId) {
      var oldVariable = this.workspace.getVariableById(oldId);
      if (oldVariable.type != '') {
        // Procedure arguments always have the empty type.
        return;
      }
      var oldName = oldVariable.name;
      var newVar = this.workspace.getVariableById(newId);

      var change = false;
      for (var i = 0; i < this.argumentVarModels_.length; i++) {
        if (this.argumentVarModels_[i].getId() == oldId) {
          this.arguments_[i] = newVar.name;
          this.argumentVarModels_[i] = newVar;
          change = true;
        }
      }
      if (change) {
        this.displayRenamedVar_(oldName, newVar.name);
      }
    },
    /**
     * Notification that a variable is renaming but keeping the same ID.  If the
     * variable is in use on this block, rerender to show the new name.
     * @param {!Blockly.VariableModel} variable The variable being renamed.
     * @package
     * @override
     * @this Blockly.Block
     */
    updateVarName: function (variable) {
      var newName = variable.name;
      var change = false;
      for (var i = 0; i < this.argumentVarModels_.length; i++) {
        if (this.argumentVarModels_[i].getId() == variable.getId()) {
          var oldName = this.arguments_[i];
          this.arguments_[i] = newName;
          change = true;
        }
      }
      if (change) {
        this.displayRenamedVar_(oldName, newName);
      }
    },
    /**
     * Update the display to reflect a newly renamed argument.
     * @param {string} oldName The old display name of the argument.
     * @param {string} newName The new display name of the argument.
     * @private
     */
    displayRenamedVar_: function (oldName, newName) {
      this.updateShape_();
      // Update the mutator's variables if the mutator is open.
      if (this.mutator.isVisible()) {
        var blocks = this.mutator.workspace_.getAllBlocks(false);
        for (var i = 0, block; block = blocks[i]; i++) {
          if (block.type == 'procedures_mutatorarg' &&
            Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
            block.setFieldValue(newName, 'NAME');
          }
        }
      }
    },
    /**
     * Add custom menu options to this block's context menu.
     * @param {!Array} options List of menu options to add to.
     * @this Blockly.Block
     */
    customContextMenu: function (options) {
      if (this.isInFlyout) {
        return;
      }
      // Add option to create caller.
      var option = { enabled: true };
      var name = this.getFieldValue('NAME');
      option.text = Blockly.Msg['PROCEDURES_CREATE_DO'].replace('%1', name);
      var xmlMutation = document.createElement('mutation');
      xmlMutation.setAttribute('name', name);
      for (var i = 0; i < this.arguments_.length; i++) {
        var xmlArg = document.createElement('arg');
        xmlArg.setAttribute('name', this.arguments_[i]);
        xmlMutation.appendChild(xmlArg);
      }
      var xmlBlock = document.createElement('block');
      xmlBlock.setAttribute('type', this.callType_);
      xmlBlock.appendChild(xmlMutation);
      option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
      options.push(option);

      // Add options to create getters for each parameter.
      if (!this.isCollapsed()) {
        for (var i = 0; i < this.argumentVarModels_.length; i++) {
          var option = { enabled: true };
          var argVar = this.argumentVarModels_[i];
          var name = argVar.name;
          option.text = Blockly.Msg['VARIABLES_SET_CREATE_GET'].replace('%1', name);

          var xmlField = Blockly.Variables.generateVariableFieldDom(argVar);
          var xmlBlock = document.createElement('block');
          xmlBlock.setAttribute('type', 'variables_get');
          xmlBlock.appendChild(xmlField);
          option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
          options.push(option);
        }
      }
    },
    callType_: 'procedures_callnoreturn',
    getArgType: function (varName) {
      for (let i = 0; i < this.arguments_.length; i++) {
        if (varName === this.arguments_[i]) {
          const inputTypeName = `ARG_TYPE_${i}`;
          return Blockly.Types.getTypeFromText(this.getFieldValue(inputTypeName));
        }
      }
      console.error(`unhandle procedure arg types ${varName}`);
      return  Blockly.Types.UNDEF;
    },
    getReturnType: function() {
      return  Blockly.Types.getTypeFromText(this.getFieldValue('RETURN_TYPE'));
    }
  };


  Blockly.Blocks['procedures_argument'] = {
    init: function () {
      this.appendDummyInput().appendField('argument', 'NAME');
      this.setOutput(true, null);
      this.setColour(Blockly.Msg['MicFunHUE']);
      this.argName = 'argument';
    },
    setArgName: function (argName) {
      this.argName = argName;
      this.setFieldValue(argName, 'NAME');
    },
    mutationToDom: function () {
      var container = document.createElement('mutation');
      container.setAttribute('name', this.argName);
      return container;
    },
    domToMutation: function (xmlElement) {
      if (xmlElement) {
        const argName = xmlElement.getAttribute('name');
        this.setArgName(argName);
      }
    },
  }

  Blockly.Blocks['procedures_callnoreturn'] = {
    /**
     * Block for calling a procedure with no return value.
     * @this Blockly.Block
     */
    init: function () {
      this.appendDummyInput('TOPROW')
        .appendField(this.id, 'NAME');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setColour(Blockly.Msg['MicFunHUE']);
      // Tooltip is set in renameProcedure.
      this.setHelpUrl(Blockly.Msg['PROCEDURES_CALLNORETURN_HELPURL']);
      this.arguments_ = [];
      this.argumentVarModels_ = [];
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
      this.previousDisabledState_ = false;
    },

    /**
     * Returns the name of the procedure this block calls.
     * @return {string} Procedure name.
     * @this Blockly.Block
     */
    getProcedureCall: function () {
      // The NAME field is guaranteed to exist, null will never be returned.
      return /** @type {string} */ (this.getFieldValue('NAME'));
    },
    /**
     * Notification that a procedure is renaming.
     * If the name matches this block's procedure, rename it.
     * @param {string} oldName Previous name of procedure.
     * @param {string} newName Renamed procedure.
     * @this Blockly.Block
     */
    renameProcedure: function (oldName, newName) {
      if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
        this.setFieldValue(newName, 'NAME');
        var baseMsg = this.outputConnection ?
          Blockly.Msg['PROCEDURES_CALLRETURN_TOOLTIP'] :
          Blockly.Msg['PROCEDURES_CALLNORETURN_TOOLTIP'];
        this.setTooltip(baseMsg.replace('%1', newName));
      }
    },
    /**
     * Notification that the procedure's parameters have changed.
     * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
     * @param {!Array.<string>} paramIds IDs of params (consistent for each
     *     parameter through the life of a mutator, regardless of param renaming),
     *     e.g. ['piua', 'f8b_', 'oi.o'].
     * @private
     * @this Blockly.Block
     */
    setProcedureParameters_: function (paramNames, paramIds) {
      // Data structures:
      // this.arguments = ['x', 'y']
      //     Existing param names.
      // this.quarkConnections_ {piua: null, f8b_: Blockly.Connection}
      //     Look-up of paramIds to connections plugged into the call block.
      // this.quarkIds_ = ['piua', 'f8b_']
      //     Existing param IDs.
      // Note that quarkConnections_ may include IDs that no longer exist, but
      // which might reappear if a param is reattached in the mutator.
      var defBlock = Blockly.Procedures.getDefinition(this.getProcedureCall(),
        this.workspace);
      var mutatorOpen = defBlock && defBlock.mutator &&
        defBlock.mutator.isVisible();
      if (!mutatorOpen) {
        this.quarkConnections_ = {};
        this.quarkIds_ = null;
      }
      if (!paramIds) {
        // Reset the quarks (a mutator is about to open).
        return;
      }
      // Test arguments (arrays of strings) for changes. '\n' is not a valid
      // argument name character, so it is a valid delimiter here.
      if (paramNames.join('\n') == this.arguments_.join('\n')) {
        // No change.
        this.quarkIds_ = paramIds;
        return;
      }
      if (paramIds.length != paramNames.length) {
        throw RangeError('paramNames and paramIds must be the same length.');
      }
      this.setCollapsed(false);
      if (!this.quarkIds_) {
        // Initialize tracking for this block.
        this.quarkConnections_ = {};
        this.quarkIds_ = [];
      }
      // Switch off rendering while the block is rebuilt.
      var savedRendered = this.rendered;
      this.rendered = false;
      // Update the quarkConnections_ with existing connections.
      for (var i = 0; i < this.arguments_.length; i++) {
        var input = this.getInput('ARG' + i);
        if (input) {
          var connection = input.connection.targetConnection;
          this.quarkConnections_[this.quarkIds_[i]] = connection;
          if (mutatorOpen && connection &&
            paramIds.indexOf(this.quarkIds_[i]) == -1) {
            // This connection should no longer be attached to this block.
            connection.disconnect();
            connection.getSourceBlock().bumpNeighbours_();
          }
        }
      }
      // Rebuild the block's arguments.
      this.arguments_ = [].concat(paramNames);
      // And rebuild the argument model list.
      this.argumentVarModels_ = [];
      // for (var i = 0; i < this.arguments_.length; i++) {
      // var variable = Blockly.Variables.getOrCreateVariablePackage(
      //     this.workspace, null, this.arguments_[i], '');
      // this.argumentVarModels_.push(variable);
      // }

      this.updateShape_();
      this.initSvg();

      this.quarkIds_ = paramIds;
      // Reconnect any child blocks.
      if (this.quarkIds_) {
        for (var i = 0; i < this.arguments_.length; i++) {
          var quarkId = this.quarkIds_[i];
          if (quarkId in this.quarkConnections_) {
            var connection = this.quarkConnections_[quarkId];
            if (!Blockly.Mutator.reconnect(connection, this, 'ARG' + i)) {
              // Block no longer exists or has been attached elsewhere.
              delete this.quarkConnections_[quarkId];
            }
          }
        }
      }
      // Restore rendering and show the changes.
      this.rendered = savedRendered;
      if (this.rendered) {
        this.render();
      }
    },
    /**
     * Modify this block to have the correct number of arguments.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
      for (var i = 0; i < this.arguments_.length; i++) {
        var field = this.getField('ARGNAME' + i);
        if (field) {
          // Ensure argument name is up to date.
          // The argument name field is deterministic based on the mutation,
          // no need to fire a change event.
          Blockly.Events.disable();
          try {
            field.setValue(this.arguments_[i]);
          } finally {
            Blockly.Events.enable();
          }
        } else {
          // Add new input.
          field = new Blockly.FieldLabel(this.arguments_[i]);
          var input = this.appendValueInput('ARG' + i)
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(field, 'ARGNAME' + i);
          input.init();
        }
      }
      // Remove deleted inputs.
      while (this.getInput('ARG' + i)) {
        this.removeInput('ARG' + i);
        i++;
      }
      // Add 'with:' if there are parameters, remove otherwise.
      var topRow = this.getInput('TOPROW');
      if (topRow) {
        if (this.arguments_.length) {
          if (!this.getField('WITH')) {
            // topRow.appendField(Blockly.Msg['PROCEDURES_CALL_BEFORE_PARAMS'], 'WITH');
            topRow.init();
          }
        } else {
          if (this.getField('WITH')) {
            topRow.removeField('WITH');
          }
        }
      }
    },
    /**
     * Create XML to represent the (non-editable) name and arguments.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
      var container = document.createElement('mutation');
      container.setAttribute('name', this.getProcedureCall());
      for (var i = 0; i < this.arguments_.length; i++) {
        var parameter = document.createElement('arg');
        parameter.setAttribute('name', this.arguments_[i]);
        container.appendChild(parameter);
      }
      return container;
    },
    /**
     * Parse XML to restore the (non-editable) name and parameters.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
      var name = xmlElement.getAttribute('name');
      this.renameProcedure(this.getProcedureCall(), name);
      var args = [];
      var paramIds = [];
      for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
        if (childNode.nodeName.toLowerCase() == 'arg') {
          args.push(childNode.getAttribute('name'));
          paramIds.push(childNode.getAttribute('paramId'));
        }
      }
      this.setProcedureParameters_(args, paramIds);
    },
    /**
     * Return all variables referenced by this block.
     * @return {!Array.<!Blockly.VariableModel>} List of variable models.
     * @this Blockly.Block
     */
    // getVarModels: function() {
    //   return this.argumentVarModels_;
    // },
    /**
     * Procedure calls cannot exist without the corresponding procedure
     * definition.  Enforce this link whenever an event is fired.
     * @param {!Blockly.Events.Abstract} event Change event.
     * @this Blockly.Block
     */
    onchange: function (event) {
      if (!this.workspace || this.workspace.isFlyout) {
        // Block is deleted or is in a flyout.
        return;
      }
      if (!event.recordUndo) {
        // Events not generated by user. Skip handling.
        return;
      }
      if (event.type == Blockly.Events.BLOCK_CREATE &&
        event.ids.indexOf(this.id) != -1) {
        // Look for the case where a procedure call was created (usually through
        // paste) and there is no matching definition.  In this case, create
        // an empty definition block with the correct signature.
        var name = this.getProcedureCall();
        var def = Blockly.Procedures.getDefinition(name, this.workspace);
        if (def && (def.type != this.defType_ ||
          JSON.stringify(def.arguments_) != JSON.stringify(this.arguments_))) {
          // The signatures don't match.
          def = null;
        }
        if (!def) {
          Blockly.Events.setGroup(event.group);
          /**
           * Create matching definition block.
           * <xml>
           *   <block type="procedures_defreturn" x="10" y="20">
           *     <mutation name="test">
           *       <arg name="x"></arg>
           *     </mutation>
           *     <field name="NAME">test</field>
           *   </block>
           * </xml>
           */
          var xml = document.createElement('xml');
          var block = document.createElement('block');
          block.setAttribute('type', this.defType_);
          var xy = this.getRelativeToSurfaceXY();
          var x = xy.x + Blockly.SNAP_RADIUS * (this.RTL ? -1 : 1);
          var y = xy.y + Blockly.SNAP_RADIUS * 2;
          block.setAttribute('x', x);
          block.setAttribute('y', y);
          var mutation = this.mutationToDom();
          block.appendChild(mutation);
          var field = document.createElement('field');
          field.setAttribute('name', 'NAME');
          field.appendChild(document.createTextNode(this.getProcedureCall()));
          block.appendChild(field);
          xml.appendChild(block);
          Blockly.Xml.domToWorkspace(xml, this.workspace);
          Blockly.Events.setGroup(false);
        }
      } else if (event.type == Blockly.Events.BLOCK_DELETE) {
        // Look for the case where a procedure definition has been deleted,
        // leaving this block (a procedure call) orphaned.  In this case, delete
        // the orphan.
        var name = this.getProcedureCall();
        var def = Blockly.Procedures.getDefinition(name, this.workspace);
        if (!def) {
          Blockly.Events.setGroup(event.group);
          this.dispose(true, false);
          Blockly.Events.setGroup(false);
        }
      } else if (event.type == Blockly.Events.CHANGE && event.element == 'disabled') {
        var name = this.getProcedureCall();
        var def = Blockly.Procedures.getDefinition(name, this.workspace);
        if (def && def.id == event.blockId) {
          // in most cases the old group should be ''
          var oldGroup = Blockly.Events.getGroup();
          if (oldGroup) {
            // This should only be possible programatically and may indicate a problem
            // with event grouping. If you see this message please investigate. If the
            // use ends up being valid we may need to reorder events in the undo stack.
            console.log('Saw an existing group while responding to a definition change');
          }
          Blockly.Events.setGroup(event.group);
          if (event.newValue) {
            this.previousDisabledState_ = this.disabled;
            this.setDisabled(true);
          } else {
            this.setDisabled(this.previousDisabledState_);
          }
          Blockly.Events.setGroup(oldGroup);
        }
      }
    },
    /**
     * Add menu option to find the definition block for this call.
     * @param {!Array} options List of menu options to add to.
     * @this Blockly.Block
     */
    customContextMenu: function (options) {
      var option = { enabled: true };
      option.text = Blockly.Msg['PROCEDURES_HIGHLIGHT_DEF'];
      var name = this.getProcedureCall();
      var workspace = this.workspace;
      option.callback = function () {
        var def = Blockly.Procedures.getDefinition(name, workspace);
        if (def) {
          workspace.centerOnBlock(def.id);
          def.select();
        }
      };
      options.push(option);
    },
    defType_: 'procedures_defnoreturn'
  };

  Blockly.Blocks['procedures_callreturn'] = {
    /**
     * Block for calling a procedure with a return value.
     * @this Blockly.Block
     */
    init: function () {
      this.appendDummyInput('TOPROW')
        .appendField('', 'NAME');
      this.setOutput(true);
      this.setColour(Blockly.Msg['PROCEDURES_HUE']);
      this.setInputsInline(true);
      // Tooltip is set in domToMutation.
      this.setHelpUrl(Blockly.Msg['PROCEDURES_CALLRETURN_HELPURL']);
      this.arguments_ = [];
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
      this.previousDisabledState_ = false;
    },

    getProcedureCall: Blockly.Blocks['procedures_callnoreturn'].getProcedureCall,
    renameProcedure: Blockly.Blocks['procedures_callnoreturn'].renameProcedure,
    setProcedureParameters_:
      Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters_,
    updateShape_: Blockly.Blocks['procedures_callnoreturn'].updateShape_,
    mutationToDom: Blockly.Blocks['procedures_callnoreturn'].mutationToDom,
    domToMutation: Blockly.Blocks['procedures_callnoreturn'].domToMutation,
    // getVarModels: Blockly.Blocks['procedures_callnoreturn'].getVarModels,
    onchange: Blockly.Blocks['procedures_callnoreturn'].onchange,
    customContextMenu:
      Blockly.Blocks['procedures_callnoreturn'].customContextMenu,
    defType_: 'procedures_defnoreturn' // 修复函数重复定义的 bug
  };
}

export default FixProcedure;
