import React, { Component } from 'react';
import './assets/style/index.less';
import './assets/style/page.less';
import { Provider } from 'mobx-react';
import Editor from './component/editor';
import Sidebar from './component/sidebar';
import deviceController from './controller/device_controller';
import { EventBus } from './util/eventbus';
import { IDEEvent } from './util/events';
import store from './store';
import { EditorMode, getEditorModeString } from './util/editor';
import LoadGeneralDefine from "./blockly/block/index";
import LoadArduinoBlocks from './blockly/block/arduino/index';
import LoadMicropythonBlocks from "./blockly/block/microPython/index";
import Debug from './component/debug';
import File from './util/file';
import codingController from './controller/coding_controller';
import {BLOCKLY_TO_CODE, SUPPORT_KITS} from "./util/constance";

interface AppProps {

}

interface AppState {
  kit: string,
  isLogin: boolean,
  subtype: string
}

interface IdeData {
  code: string,
  projectMode: string,
  editorMode: string,
  xml: string,
}

declare global {
  interface Window {
    showBrowserVersionTips: any
  }
}

const { showBrowserVersionTips } = window;

class App extends Component<AppProps, AppState> {
  private refEditor = React.createRef<Editor>();

  private hideDebug = false;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      kit: this.getDefaultKit(),
      isLogin: false,
      // eslint-disable-next-line
      subtype: 'Arduino',
    };

    showBrowserVersionTips(77, false);

    LoadGeneralDefine();
    LoadArduinoBlocks();
    LoadMicropythonBlocks();
  }

  render() {
    deviceController.setKit(this.state.kit);
    return (
      <Provider {...store}>
        <div className="layout">
        {
          this.hideDebug
            ? null : (
              <div className="layout-ide-debug">
                <Debug
                  importFile={this.importFile}
                  exportFile={this.exportFile}
                  exportCover={this.exportCover}
                  newFile={this.new}
                  changeKit={this.onChangeKit}
                />
              </div>
            )
        }
        <div className="layout-container">
          <Editor ref={this.refEditor} kit={this.state.kit} mode={getEditorModeString(store.EditorStore.editorMode)} />
          <Sidebar />
        </div>
        </div>
      </Provider>
    );
  }

  componentDidMount() {
    EventBus.on(IDEEvent[IDEEvent.CHANGE_MODE], this.onChangeMode);
    EventBus.on(IDEEvent[IDEEvent.NEW_PROJECT], this.new);
    EventBus.on(IDEEvent[IDEEvent.IMPORT_PROJECT], this.import);
    EventBus.on(IDEEvent[IDEEvent.EXPORT_PROJECT], this.export);
    EventBus.on(IDEEvent[IDEEvent.EXPORT_COVER], this.exportCover);
    EventBus.on(IDEEvent[IDEEvent.UPLOAD_CODE], this.onUpload);
    EventBus.on(IDEEvent[IDEEvent.CHANGE_KIT], this.onChangeKit);

    codingController.init();
  }

  componentWillUnmount() {
    EventBus.off(IDEEvent[IDEEvent.CHANGE_MODE], this.onChangeMode);
    EventBus.off(IDEEvent[IDEEvent.NEW_PROJECT], this.new);
    EventBus.off(IDEEvent[IDEEvent.IMPORT_PROJECT], this.import);
    EventBus.off(IDEEvent[IDEEvent.EXPORT_PROJECT], this.export);
    EventBus.off(IDEEvent[IDEEvent.EXPORT_COVER], this.exportCover);
    EventBus.off(IDEEvent[IDEEvent.UPLOAD_CODE], this.onUpload);
    EventBus.off(IDEEvent[IDEEvent.CHANGE_KIT], this.onChangeKit);
  }

  getDefaultKit = () => {
    const iframe = document.querySelector('#ide');
    if (iframe) {
      // @ts-ignore
      const search = iframe.contentWindow.location.search; //'?KIT=ESP_LITE&LAN=CN/';
      const regexpParam = /\??([\w\d%]+)=([\w\d%]*)&?/g;
      const ret = regexpParam.exec(search);
      if (ret) {
        // @ts-ignore
        return SUPPORT_KITS[ret[2]];
      }
    }
    return SUPPORT_KITS.ESP_LITE;
  }

  onChangeMode = () => {
    this.refEditor.current!.updateCodeEditorCode();
  }

  onUpload = async () => {
    const generator = BLOCKLY_TO_CODE[this.state.kit];
    const code = generator(this.refEditor.current!.getWorkSpace());
    await deviceController.handleBurning(code);
  }

  exportFile = () => {
    File.download({ content: this.export() });
  }

  export = () => {
    const editorMode = (store.EditorStore.editorMode === EditorMode.BLOCK) ? EditorMode.CODE : EditorMode.BLOCK;
    const editorModeString = getEditorModeString(editorMode);
    const blocklyWorkspace = this.refEditor.current!.getXml();

    const code = '';
    const subType = store.EditorStore.subType;

    const data: IdeData = {
      code,
      xml: blocklyWorkspace,
      editorMode: editorModeString,
      projectMode: subType,
    };
    const exportData = { ...data };

    console.log('[arduino][export] exportData:', exportData);
    store.EditorStore.setBlocklyWorkspace(blocklyWorkspace);
    return JSON.stringify(exportData);
  }

  importFile = (file: any) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target!.result && typeof (evt.target!.result) === 'string') {
        try {
          this.import(JSON.parse(evt.target!.result));
        } catch (e) {
          console.log(e);
        }
      }
    };
    reader.readAsText(file, 'UTF-8');
  }

  exportCover = () => ''

  import = (data: any) => {
    Blockly.hideChaff();
    if (!data.projectMode) {
      console.error('[import] projectMode为空');
      return;
    }

    const retData = { ...data };

    const {
      code,
      xml,
    } = retData;

    this.refEditor.current!.setWorkSpace(xml);
    store.EditorStore.setBlocklyWorkspace(xml);
    console.log('[import] code:', code);
    console.log('xmlxmlxml:', xml);
  }

  new = () => {
    if (this.refEditor.current) {
      this.refEditor.current.clearWorkspace();
    }
  }

  onChangeKit = (kit: string) => {
    kit = 'ESP';
    // @ts-ignore
    this.setState({
      // @ts-ignore
      kit: SUPPORT_KITS[kit]
    });
  }
}

export default App;
