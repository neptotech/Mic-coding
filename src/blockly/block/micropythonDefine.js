/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Based on work of Fred Lin (gasolin@gmail.com) for Blocklyduino.
 *
 * @fileoverview Helper functions for generating Arduino language (C++).
 */
'use strict';

goog.provide('Blockly.MicroPython');

goog.require('Blockly.Generator');
goog.require('Blockly.StaticTyping');

'use strict';

const LoadMicropythonDefine = () => {
    /**
     * Arduino code generator.
     * @type {!Blockly.Generator}
     */
    Blockly.MicroPython = new Blockly.Generator('MicroPython');
    Blockly.MicroPython.StaticTyping = new Blockly.StaticTyping();
    Blockly.MicroPython.NEW_LINE = '\n';
    Blockly.MicroPython.FUNCTION_GLOBAL_PLACEHOLDER_ = '{At9vMRGBbLqOb2kw}';

    /**
     * List of illegal variable names.
     * This is not intended to be a security feature.  Blockly is 100% client-side,
     * so bypassing this list is trivial.  This is intended to prevent users from
     * accidentally clobbering a built-in object or function.
     * @private
     */
    Blockly.MicroPython.addReservedWords(
        // import keyword
        // print(','.join(sorted(keyword.kwlist)))
        // https://docs.MicroPython.org/3/reference/lexical_analysis.html#keywords
        // https://docs.MicroPython.org/2/reference/lexical_analysis.html#keywords
        'False,None,True,and,as,assert,break,class,continue,def,del,elif,else,' +
        'except,exec,finally,for,from,global,if,import,in,is,lambda,nonlocal,not,' +
        'or,pass,print,raise,return,try,while,with,yield,' +
        // https://docs.MicroPython.org/3/library/constants.html
        // https://docs.MicroPython.org/2/library/constants.html
        'NotImplemented,Ellipsis,__debug__,quit,exit,copyright,license,credits,' +
        // >>> print(','.join(sorted(dir(__builtins__))))
        // https://docs.MicroPython.org/3/library/functions.html
        // https://docs.MicroPython.org/2/library/functions.html
        'ArithmeticError,AssertionError,AttributeError,BaseException,' +
        'BlockingIOError,BrokenPipeError,BufferError,BytesWarning,' +
        'ChildProcessError,ConnectionAbortedError,ConnectionError,' +
        'ConnectionRefusedError,ConnectionResetError,DeprecationWarning,EOFError,' +
        'Ellipsis,EnvironmentError,Exception,FileExistsError,FileNotFoundError,' +
        'FloatingPointError,FutureWarning,GeneratorExit,IOError,ImportError,' +
        'ImportWarning,IndentationError,IndexError,InterruptedError,' +
        'IsADirectoryError,KeyError,KeyboardInterrupt,LookupError,MemoryError,' +
        'ModuleNotFoundError,NameError,NotADirectoryError,NotImplemented,' +
        'NotImplementedError,OSError,OverflowError,PendingDeprecationWarning,' +
        'PermissionError,ProcessLookupError,RecursionError,ReferenceError,' +
        'ResourceWarning,RuntimeError,RuntimeWarning,StandardError,' +
        'StopAsyncIteration,StopIteration,SyntaxError,SyntaxWarning,SystemError,' +
        'SystemExit,TabError,TimeoutError,TypeError,UnboundLocalError,' +
        'UnicodeDecodeError,UnicodeEncodeError,UnicodeError,' +
        'UnicodeTranslateError,UnicodeWarning,UserWarning,ValueError,Warning,' +
        'ZeroDivisionError,_,__build_class__,__debug__,__doc__,__import__,' +
        '__loader__,__name__,__package__,__spec__,abs,all,any,apply,ascii,' +
        'basestring,bin,bool,buffer,bytearray,bytes,callable,chr,classmethod,cmp,' +
        'coerce,compile,complex,copyright,credits,delattr,dict,dir,divmod,' +
        'enumerate,eval,exec,execfile,exit,file,filter,float,format,frozenset,' +
        'getattr,globals,hasattr,hash,help,hex,id,input,int,intern,isinstance,' +
        'issubclass,iter,len,license,list,locals,long,map,max,memoryview,min,' +
        'next,object,oct,open,ord,pow,print,property,quit,range,raw_input,reduce,' +
        'reload,repr,reversed,round,set,setattr,slice,sorted,staticmethod,str,' +
        'sum,super,tuple,type,unichr,unicode,vars,xrange,zip'
    );

    /**
     * Pin
     */

    Blockly.MicroPython.BUTTON_A = 0;
    Blockly.MicroPython.BUTTON_B = 35;
    Blockly.MicroPython.BUTTON_PRESSED = 0;
    Blockly.MicroPython.BUTTON_UNPRESSED = 1;

    Blockly.MicroPython.TOUCHPAD_0 = 32;
    Blockly.MicroPython.TOUCHPAD_1 = 33;
    Blockly.MicroPython.TOUCHPAD_2 = 27;
    Blockly.MicroPython.TOUCHPAD_3 = 14;
    Blockly.MicroPython.TOUCHPAD_4 = 2;
    Blockly.MicroPython.TOUCHPAD_THRESHHOLD = 100;

    Blockly.MicroPython.MUSIC = 4;
    Blockly.MicroPython.MUSIC_SILENCE = 0;
    Blockly.MicroPython.MUSIC_SOUND_DUTY = 50;

    Blockly.MicroPython.ADC_MIC = 37;
    Blockly.MicroPython.ADC_LIGHT = 38;

    Blockly.MicroPython.MPU_I2C = 21;
    Blockly.MicroPython.MPU_SDA = 22;
    Blockly.MicroPython.MPU_SCALE = 1638;

    /**
     * Order of operation ENUMs.
     * http://docs.MicroPython.org/reference/expressions.html#summary
     */
    Blockly.MicroPython.ORDER_ATOMIC = 0; // 0 "" ...
    Blockly.MicroPython.ORDER_COLLECTION = 1;// tuples, lists, dictionaries
    Blockly.MicroPython.ORDER_STRING_CONVERSION = 1 // `expression...`
    Blockly.MicroPython.ORDER_MEMBER = 2.1; // . []
    Blockly.MicroPython.ORDER_FUNCTION_CALL = 2.2; // ()
    Blockly.MicroPython.ORDER_EXPONENTIATION = 3; // **
    Blockly.MicroPython.ORDER_UNARY_SIGN = 4; // + -
    Blockly.MicroPython.ORDER_BITWISE_NOT = 4; // ~
    Blockly.MicroPython.ORDER_MULTIPLICATIVE = 5; // * / // %
    Blockly.MicroPython.ORDER_ADDITIVE = 6; // + -
    Blockly.MicroPython.ORDER_BITWISE_SHIFT = 7; // << >>
    Blockly.MicroPython.ORDER_BITWISE_AND = 8; // &
    Blockly.MicroPython.ORDER_BITWISE_XOR = 9; // ^
    Blockly.MicroPython.ORDER_BITWISE_OR = 10; // |
    Blockly.MicroPython.ORDER_RELATIONAL = 11; // in, not in, is, is not,
    //     <, <=, >, >=, <>, !=, ==
    Blockly.MicroPython.ORDER_LOGICAL_NOT = 12; // not
    Blockly.MicroPython.ORDER_LOGICAL_AND = 13; // and
    Blockly.MicroPython.ORDER_LOGICAL_OR = 14; // or
    Blockly.MicroPython.ORDER_CONDITIONAL = 15; // if else
    Blockly.MicroPython.ORDER_LAMBDA = 16; // lambda
    Blockly.MicroPython.ORDER_NONE = 99; // (...)

    Blockly.MicroPython.DEFINITION_PREFIX = {
        VARIABLE: 'VARIABLE_',
        SCRATCH_VARIABLE: 'SCRATCH_VARIABLE_',
        INCLUDE: 'INCLUDE_',
        DEFINE: 'DEFINE_',
        FUNCTION: 'FUNCTION_',
        SCRATCH_FUNCTION: 'SCRATCH_FUNCTION_'
    };

    /**
     * List of outer-inner pairings that do NOT require parentheses.
     * @type {!Array.<!Array.<number>>}
     */
    Blockly.MicroPython.ORDER_OVERRIDES = [
        // (foo()).bar -> foo().bar
        // (foo())[0] -> foo()[0]
        [Blockly.MicroPython.ORDER_FUNCTION_CALL, Blockly.MicroPython.ORDER_MEMBER],
        // (foo())() -> foo()()
        [Blockly.MicroPython.ORDER_FUNCTION_CALL, Blockly.MicroPython.ORDER_FUNCTION_CALL],
        // (foo.bar).baz -> foo.bar.baz
        // (foo.bar)[0] -> foo.bar[0]
        // (foo[0]).bar -> foo[0].bar
        // (foo[0])[1] -> foo[0][1]
        [Blockly.MicroPython.ORDER_MEMBER, Blockly.MicroPython.ORDER_MEMBER],
        // (foo.bar)() -> foo.bar()
        // (foo[0])() -> foo[0]()
        [Blockly.MicroPython.ORDER_MEMBER, Blockly.MicroPython.ORDER_FUNCTION_CALL],

        // not (not foo) -> not not foo
        [Blockly.MicroPython.ORDER_LOGICAL_NOT, Blockly.MicroPython.ORDER_LOGICAL_NOT],
        // a and (b and c) -> a and b and c
        [Blockly.MicroPython.ORDER_LOGICAL_AND, Blockly.MicroPython.ORDER_LOGICAL_AND],
        // a or (b or c) -> a or b or c
        [Blockly.MicroPython.ORDER_LOGICAL_OR, Blockly.MicroPython.ORDER_LOGICAL_OR]
    ]

    Blockly.MicroPython.importFile = (fileName) => {
        Blockly.MicroPython.import_[fileName] = `import ${fileName}`;

        let defineName;
        if (Blockly.MicroPython.importTemp_[fileName]) {
            defineName = Blockly.MicroPython.importTemp_[fileName];
        } else {
            defineName = Blockly.MicroPython.variableDB_.getDistinctName(fileName, Blockly.VARIABLE_CATEGORY_NAME);
            Blockly.MicroPython.importTemp_[fileName] = defineName;
        }
        return defineName;
    }

    Blockly.MicroPython.importFromFile = (fileName, funcName) => {
        const fileFunc = `${fileName}_${funcName}`;
        Blockly.MicroPython.import_[fileFunc] = `from ${fileName} import ${funcName}`;

        let defineName;
        if (Blockly.MicroPython.importTemp_[fileFunc]) {
            defineName = Blockly.MicroPython.importTemp_[fileFunc];
        } else {
            defineName = Blockly.MicroPython.variableDB_.getDistinctName(fileFunc, Blockly.VARIABLE_CATEGORY_NAME);
            Blockly.MicroPython.importTemp_[fileFunc] = defineName;
        }
        // console.log('defineName', defineName)
        return (!funcName || funcName === '*') ? '' : funcName;
    }

    Blockly.MicroPython.makeVariable = function (name, value, noS = false) {
        let tmpName = name;
        let arr;
        if (Array.isArray(tmpName)) {
            tmpName = name[0];
            arr = name[1];
        }
        let code = `${tmpName}${arr !== undefined ? `${arr}` : ''}`
        if (typeof value !== 'undefined') {
            if (value.toString().startsWith('(')) {
                code += value;
            } else {
                code += ` = ${value}`;
            }
        } else if (!noS) {
            code += ';';
        }
        return code;
    }

    Blockly.MicroPython.defineVariable = function (desiredName, value, remember = true) {
        let arr;
        if (Array.isArray(desiredName)) {
            arr = desiredName[1];
            desiredName = desiredName[0];
        }
        if (remember && Blockly.MicroPython.rememberVariable_[desiredName]) {
            return Blockly.MicroPython.rememberVariable_[desiredName];
        }
        const name = this.variableDB_.getDistinctName(desiredName, Blockly.VARIABLE_CATEGORY_NAME);
        Blockly.MicroPython.definitions_[Blockly.MicroPython.DEFINITION_PREFIX.VARIABLE + name] = Blockly.MicroPython.makeVariable([name, arr], value);
        if (remember) {
            Blockly.MicroPython.rememberVariable_[desiredName] = name;
        }
        return name;
    }

    Blockly.MicroPython.setupDefine = function (code) {
        if (Blockly.MicroPython.setupDefs_[code]) {
            return;
        }
        Blockly.MicroPython.setupDefs_[code] = [Blockly.MicroPython.setupDefsCount_++, `${code}`];
    }

    /**
     * Initialise the database of variable names.
     * @param {!Blockly.Workspace} workspace Workspace to generate code from.
     * @param {!vm.target} target scratch-vm target
     */
    Blockly.MicroPython.init = function (workspace, target) {
        /**
         * Empty loops or conditionals are not allowed in MicroPython.
         */
        Blockly.MicroPython.PASS = this.INDENT + 'pass\n';
        Blockly.MicroPython.INDEX = Object.create(null);
        // Create a dictionary of definitions to be printed before the code.
        Blockly.MicroPython.definitions_ = Object.create(null);
        Blockly.MicroPython.rememberVariable_ = Object.create(null);
        // Create a dictionary mapping desired function names in definitions_
        // to actual function names (to avoid collisions with user functions).
        Blockly.MicroPython.functionNames_ = Object.create(null);
        Blockly.MicroPython.currentWorkspace = workspace;
        Blockly.MicroPython.importTemp_ = Object.create(null);
        Blockly.MicroPython.import_ = Object.create(null);
        Blockly.MicroPython.setupDefs_ = Object.create(null);
        // Blockly.MicroPython.setups_ = Object.create(null);

        if (!Blockly.MicroPython.variableDB_) {
            Blockly.MicroPython.variableDB_ =
                new Blockly.Names(Blockly.MicroPython.RESERVED_WORDS_);
        } else {
            Blockly.MicroPython.variableDB_.reset();
        }

        const blocks = workspace.getAllBlocks(false);
        blocks.forEach((block) => {
            if (block.type === Blockly.PROCEDURES_PROTOTYPE_BLOCK_TYPE) {
                const funcName = block.inputList[0].fieldRow[0].getText();
                const callFuncName = Blockly.MicroPython.provideFunction_(funcName);
                const space = new Blockly.Names(Blockly.MicroPython.RESERVED_WORDS_);
                block.funcName = funcName;
                block.callFuncName = callFuncName;
                block.displayNamesMap_ = [];
                block.argumentTypes_ = [];
                block.displayNames_.forEach((value, index) => {
                    if (block.argumentDefaults_[index] === '') {
                        block.argumentTypes_[index] = 'string';
                    } else if (block.argumentDefaults_[index] === 'false') {
                        block.argumentTypes_[index] = 'boolean';
                    } else {
                        block.argumentTypes_[index] = 'int';
                    }
                    block.displayNamesMap_[index] = space.getDistinctName(value,
                        Blockly.Procedures.PROCEDURE_CATEGORY_NAME);
                })
            }
        })

        var defvars = [];
        // Add developer variables (not created or named by the user).
        var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
        for (var i = 0; i < devVarList.length; i++) {
          defvars.push(Blockly.MicroPython.variableDB_.getName(devVarList[i],
              Blockly.Names.DEVELOPER_VARIABLE_TYPE) + ' = None');
        }

        // Add user variables, but only ones that are being used.
        var variables = Blockly.Variables.allUsedVarModels(workspace);
        for (var i = 0; i < variables.length; i++) {
          defvars.push(Blockly.MicroPython.variableDB_.getName(variables[i].getId(),
              Blockly.Variables.NAME_TYPE) + ' = None');
        }

        Blockly.MicroPython.definitions_['variables'] = defvars.join('\n');
    }

    /**
     * Prepend the generated code with the variable definitions.
     * @param {string} code Generated code.
     * @return {string} Completed code.
     */
    Blockly.MicroPython.finish = function (code) {
        // Convert the definitions dictionary into a list.
        const imports = Object.keys(Blockly.MicroPython.import_).map((key) => Blockly.MicroPython.import_[key]);
        const definitions = Object.keys(Blockly.MicroPython.definitions_).map((key) => Blockly.MicroPython.definitions_[key]);
        const setup = Object.keys(Blockly.MicroPython.setupDefs_);

        // Clean up temporary data.
        delete Blockly.MicroPython.definitions_;
        delete Blockly.MicroPython.functionNames_;
        delete Blockly.MicroPython.setups_;

        Blockly.MicroPython.variableDB_.reset();
        const allDefs = imports.join('\n') + '\n\n' + definitions.join('\n') + '\n\n' + setup.join('\n\n');
        return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
    }

    /**
     * Naked values are top-level blocks with outputs that aren't plugged into
     * anything.
     * @param {string} line Line of generated code.
     * @return {string} Legal line of code.
     */
    Blockly.MicroPython.scrubNakedValue = function (line) {
        return line + '\n';
    }

    /**
     * Encode a string as a properly escaped MicroPython string, complete with quotes.
     * @param {string} string Text to encode.
     * @return {string} MicroPython string.
     * @private
     */
    Blockly.MicroPython.quote_ = function (string) {
        // Can't use goog.string.quote since % must also be escaped.
        string = string.replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\\n')
            .replace(/%/g, '\\%');

        // Follow the CMicroPython behaviour of repr() for a non-byte string.
        let quote = '\'';
        if (string.includes('\'')) {
            if (!string.includes('"')) {
                quote = '"';
            } else {
                string = string.replace(/'/g, '\\\'');
            }
        }
        return quote + string + quote;
    }

    Blockly.MicroPython.stripQuote_ = function (string) {
        // Follow the CMicroPython behaviour of repr() for a non-byte string.
        let quote = '\'';
        return string.replace(new RegExp(`(^${quote}|${quote}$)`, 'g'), '');
    }

    /**
     * Common tasks for generating MicroPython from blocks.
     * Handles comments for the specified block and any connected value blocks.
     * Calls any statements following this block.
     * @param {!Blockly.Block} block The current block.
     * @param {string} code The MicroPython code created for this block.
     * @return {string} MicroPython code with comments and subsequent blocks added.
     * @private
     */
    Blockly.MicroPython.scrub_ = function (block, code) {
        let commentCode = '';
        // Only collect comments for blocks that aren't inline.
        if (!block.outputConnection || !block.outputConnection.targetConnection) {
            // Collect comment for this block.
            let comment = block.getCommentText();
            comment = Blockly.utils.wrap(comment, Blockly.MicroPython.COMMENT_WRAP - 3);
            if (comment) {
                if (block.getProcedureDef) {
                    // Use a comment block for function comments.
                    commentCode += '"""' + comment + '\n"""\n';
                } else {
                    commentCode += Blockly.MicroPython.prefixLines(comment + '\n', '# ');
                }
            }
            // Collect comments for all value arguments.
            // Don't collect comments for nested statements.
            for (let i = 0; i < block.inputList.length; i++) {
                if (block.inputList[i].type === Blockly.INPUT_VALUE) {
                    const childBlock = block.inputList[i].connection.targetBlock();
                    if (childBlock) {
                        const comment = Blockly.MicroPython.allNestedComments(childBlock);
                        if (comment) {
                            commentCode += Blockly.MicroPython.prefixLines(comment, '# ')
                        }
                    }
                }
            }
        }
        const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        const nextCode = Blockly.MicroPython.blockToCode(nextBlock);
        return commentCode + code + nextCode;
    }

    Blockly.MicroPython.provideFunction_ = function (desiredName, code, block) {
        let functionName = this.functionNames_[desiredName];
        if (!this.definitions_[desiredName]) {
            functionName = this.variableDB_.getDistinctName(desiredName,
                Blockly.Procedures.PROCEDURE_CATEGORY_NAME);
            this.definitions_[desiredName] = functionName;
            this.functionNames_[desiredName] = functionName;
        }

        if (code) {
            let codeText = code.join(Blockly.MicroPython.NEW_LINE).replace(
                this.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);

            if (block) {
                const dataBlocks = block.nextConnection.dbOpposite_.connections_.filter((item) => {
                    const source = item.getSourceBlock();
                    return source.getCategory() === 'data' && source.getRootBlock().id === block.id;
                }).map((item) => {
                    const block = item.getSourceBlock();
                    const varName = block.getField('VARIABLE').getText();
                    const v = block.workspace.getVariable(varName);
                    return Blockly.MicroPython.variableDB_.getName(v.getId(),
                        Blockly.VARIABLE_CATEGORY_NAME);
                }).filter((item, index, arr) => arr.indexOf(item) === index);

                if (dataBlocks.length > 0) {
                    codeText = codeText.replace(new RegExp(this.FUNCTION_GLOBAL_PLACEHOLDER_, 'g'), `\n\0global ${dataBlocks.join(', ')}`);
                } else {
                    codeText = codeText.replace(new RegExp(this.FUNCTION_GLOBAL_PLACEHOLDER_, 'g'), '');
                }
            }

            codeText = codeText.replace(/\0/g, this.INDENT);

            this.definitions_[desiredName] = codeText;
        }
        return this.functionNames_[desiredName];
    }
}

export default LoadMicropythonDefine;
