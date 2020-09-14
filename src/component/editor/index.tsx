import '@tencent/ec-blockly';
import AceEditor from '@tencent/ec-ace-editor';
import BlocklyEditor from '@tencent/ec-blockly-editor';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import arduino from '../../config/blink.ino';
import block from '../../config/blockly.xml';
import { EditorMode, getEditorMode } from '../../util/editor';
import store from '../../store';
import { EventBus } from '../../util/eventbus';
import { IDEEvent } from '../../util/events';
import CodingController from '../../controller/coding_controller';
import {BLOCKLY_TO_CODE, TOOLBOX} from "../../util/constance";

interface EditorProps {
  kit: string,
  mode: string
}

interface EditorState {
  kit: string,
  mode: string,
  code: string,
  xml: string,
}

declare global {
  interface Window {
    envServer: any
  }
}

const { envServer } = window;

@inject('EditorStore')
@observer
class Editor extends Component<EditorProps, EditorState> {
  private refBlocklyEditor: any = React.createRef();

  constructor(props: EditorProps) {
    super(props);
    this.state = Editor.getDefaultState(props.kit, props.mode);
  }

  componentWillReceiveProps(nextProps: Readonly<EditorProps>, nextContext: any): void {
    if (this.state.kit !== nextProps.kit) {
      this.setState({kit: nextProps.kit});
      this.refBlocklyEditor.current!.updateToolbox(TOOLBOX[nextProps.kit]);
    }
  }

  render() {
    const { kit, mode, code } = this.state;
    const aceVisible = store.EditorStore.editorMode === EditorMode.CODE;
    const isAceReadOnly = !aceVisible;
    let aceEditorZindex = 0;
    if (aceVisible || mode === 'code') {
      aceEditorZindex = 10;
    }
    const aceEditorStyle = {
      zIndex: aceEditorZindex,
    };

    const switchBtnClassName = aceVisible ? 'icon-show-block' : 'icon-show-code';
    const switchBtnClassText = aceVisible ? '显示积木' : '显示代码';

    const toolbox = TOOLBOX[kit];
    console.log(toolbox);

    return (
      <div className="layout-main">
        <BlocklyEditor
          name="hardware"
          ref={this.refBlocklyEditor}
          defaultToolbox={toolbox}
          onChange={this.onBlocklyChanged}
          readOnly={!isAceReadOnly}
        />
        <div id="_ecEditorAceContainer" style={aceEditorStyle}>
          <AceEditor
            readOnly={isAceReadOnly}
            onChange={this.onAceChanged}
            code={code}
            mode="c_cpp"
          />
        </div>

        <div className="workspace-modeswitch">
          <a
            className="workspace-modeswitch-item"
            onClick={this.toggleShowMode}
          >
            <i className={`icon ${switchBtnClassName}`} />
            {switchBtnClassText}
          </a>
        </div>
      </div>
    );
  }

  static getDefaultState = (kit:string, mode: string) => {
    if (getEditorMode(mode) === EditorMode.BLOCK) {
      return {
        code: '',
        xml: block,
        kit,
        mode
      };
    }
    return {
      code: arduino,
      xml: block,
      kit,
      mode
    };
  }

  toggleShowMode = () => {
    let { mode } = this.state;
    const preMode = mode;
    mode = mode === 'block' ? 'code' : 'block';
    if (mode === 'code') {
      store.EditorStore.setEditorMode(EditorMode.CODE);
      const code = this.getWorkSpaceCode();
      this.setState({
        code,
        mode,
      });
    } else {
      store.EditorStore.setEditorMode(EditorMode.BLOCK);
      this.setState({
        mode,
      });
    }

    EventBus.emit(IDEEvent[IDEEvent.CHANGE_MODE], preMode);
  };

  // eslint-disable-next-line
  onBlocklyChanged = (event:any, xml: string, workspace: any): void => {
    if (envServer.getEnv() === 'dev' || envServer.getEnv() === 'test') {
      console.log(this.getWorkSpaceCode());
    }
    this.setState({
      xml,
    });
    store.EditorStore.setBlocklyWorkspace(xml);
    CodingController.notifyHostBlockChanged(xml);
  }

  onAceChanged = (code: string): void => {
    console.log(`[onAceChanged] code:\n${code}`);
    this.setState({
      code,
    });
    store.EditorStore.setCode(code);
    CodingController.notifyHostCodeChanged(code);
  }

  public getXml = (): string => this.refBlocklyEditor.current!.getXml();

  public clearWorkspace = () => {
    this.refBlocklyEditor.current!.setXml('<xml />');
  }

  public setWorkSpace = (workSpace: string) => {
    this.refBlocklyEditor.current!.setXml(workSpace);
  }

  public getWorkSpaceCode = () => {
    const generator = BLOCKLY_TO_CODE[this.state.kit];
    return generator(this.refBlocklyEditor.current!.workspace)
  }

  public getWorkSpace = () => this.refBlocklyEditor.current!.workspace

  public updateCodeEditorCode = () => {
    console.log(this.getWorkSpaceCode(), 'this.getWorkSpaceCode()')
    this.setState({
      code: this.getWorkSpaceCode(),
    });
  }
}

export default Editor;
