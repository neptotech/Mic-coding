import React, { Component } from 'react';

class Debug extends Component {
  refInput = React.createRef();

  constructor(props) {
    super(props);
  }

  render() {
    const buttonStyle = {
      backgroundColor: '#4CAF50',
      border: 'none',
      color: 'white',
      padding: '5px 32px',
      margin: '5px',
      TextAlign: 'center',
      TextDecoration: 'none',
      display: 'inline-block',
      fontSize: '12px',
    };

    const {
      importFile, exportFile, exportCover, newFile, changeKit
    } = this.props;

    return (
      <div>
        <input
          type="file"
          ref={this.refInput}
          style={{ display: 'none' }}
          onChange={(e) => {
            importFile(e.target.files[0]);
            e.target.value = '';
          }}
        />
        <button id="new" style={buttonStyle} onClick={newFile}>新建作品</button>
        <button id="import" style={buttonStyle} onClick={() => this.refInput.current.click()}>导入作品</button>
        <button id="export" style={buttonStyle} onClick={exportFile}>导出作品</button>
        <button id="exportCover" style={buttonStyle} onClick={exportCover}>导出封面</button>
        <button id="changeEsp" style={buttonStyle} onClick={changeKit}>切换套件</button>
      </div>
    );
  }
}

export default Debug;
