import React, {Component} from 'react';
import './index.less';

interface DotColorProps {
    hidden: boolean,
    onChange: (v: any) => void,
    onClose: () => void,
    dotColor: string,
    defaultFill: string,
    value: string[],
    allowChoseColor: boolean,
    absolute: any
}

interface DotColorState {
    fill: string,
    hidden: boolean,
    initData: any[]
}

class DotColor extends Component<DotColorProps, DotColorState> {
    private touching: boolean;
    //@ts-ignore
    private colorData: any[];
    private current: string = '';

    constructor(props: DotColorProps) {
        super(props);
        this.colorData = this._initDotData();
        this.touching = false;
        this.state = {
            fill: props.defaultFill,
            hidden: props.hidden,
            initData: props.value.map((v) => v === '#000000' ? null : v) || [...this.colorData].map((v) => v === '#000000' ? null : v)
        };
    }

    componentWillReceiveProps(nextProps: any) {
        if (this.props.hidden !== nextProps.hidden) {
            this.setState((state) => {
                return {hidden: nextProps.hidden};
            });
        }
    }

    _initDotData = () => {
        const colorArray = new Array(64);
        for (let i = 0; i < colorArray.length; i++) {
            colorArray[i] = null;
        }
        return colorArray;
    }

    handleClear = () => {
        this.setState({initData: [...this.colorData].map((v) => v === '#000000' ? null : v)}, () => {
            this.props.onChange(this.state.initData.map((v) => v || '#000000'));
        });
    }

    onDotMouseDown = () => {
        this.touching = true;
        document.body.addEventListener('mouseover', this.onDotMouseOver);
        document.body.addEventListener('touchmove', this.onDotMouseOver);
        document.body.addEventListener('mouseup', this.onDotMouseUp);
        document.body.addEventListener('touchend', this.onDotMouseUp);
    }

    onDotMouseUp = () => {
        this.touching = false;
        document.body.removeEventListener('mouseover', this.onDotMouseOver);
        document.body.removeEventListener('touchmove', this.onDotMouseOver);
        document.body.removeEventListener('mouseup', this.onDotMouseUp);
        document.body.removeEventListener('touchend', this.onDotMouseUp);
    }

    onDotStart = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const i = e.currentTarget.getAttribute('data-index');
        this.onDotMouseDown();
        if (this.state.initData[i] === null && this.state.fill !== '#000000') {
            this.current = this.state.fill;
        } else {
            this.current = '';
        }
        this.onDotMouseOver(e);
    }

    onDotMouseOver = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        if (!this.touching) {
            return;
        }
        let i;
        if (e.touches) {
            const element = document.elementFromPoint(
                e.touches[0].clientX,
                e.touches[0].clientY);
            if (element) {
                i = element.getAttribute('data-index');
            }
        } else {
            const element = document.elementFromPoint(e.clientX, e.clientY);
            if (element) {
                i = element.getAttribute('data-index');
            }
        }
        if (i === null) {
            return;
        }
        //@ts-ignore
        this.state.initData[i] = this.current;
        this.setState({initData: this.state.initData});
        this.props.onChange(this.state.initData.map((v) => v || '#000000'));
    }

    componentWillUnmount() {
        document.body.removeEventListener('mouseup', this.onDotMouseUp);
        document.body.removeEventListener('touchend', this.onDotMouseUp);
    }

    // body全局事件监听
    onTouchStart = (e: any) => {
        e.currentTarget.innerText = 'onTouchStart';
    }

    onMouseDown = (e: any) => {
        e.currentTarget.innerText = 'onMouseDown';
    }

    render() {
        const {allowChoseColor, absolute} = this.props;
        const style = {
            width: '30px',
            height: '30px',
            verticalAlign: 'middle',
            fill: 'currentColor',
            overflow: 'hidden'
        }
        const wpStyle = (!absolute ? {} : {left: absolute.x || 0, top: absolute.y || 0});
        return (
            !this.state.hidden && <div id={'content'} style={wpStyle} className={`mdesinger-DotColor ${absolute ? 'absolute' : ''}`}>
                <div className={'buggy-bg-div'} onClick={this.props.onClose} />
                <div className={'dotWrapper'}>
                    {this.state.initData.map((v, i) => <a
                        className={'event-dotItem'}
                        data-index={i}
                        /* 官方issue 链接 https://github.com/facebook/react/issues/9809
                        * onTouchStart后还会触发onMouseDown,preventDefault也无法阻止事件传递
                        *  两种解决方案：1.componentDidMount里用dom绑定，
                        *              2.增加 onTouchEnd={e => e.preventDefault()}
                        */
                        onTouchStart={this.onDotStart}
                        onMouseDown={this.onDotStart}
                        onTouchEnd={e => e.preventDefault()}
                        style={{
                            backgroundColor: v || this.props.dotColor,
                            border: v ? '1px solid rgba(255,255,255,.3)' : 'none',
                            boxShadow: v ? `0 0 10px ${v}` : undefined
                        }} key={i} />)}
                </div>

                <ul className={`btnWrapper ${allowChoseColor ? '' : 'unChoseColor'}`}>
                    <li style={{marginLeft: '15px'}}>
                        <svg className='icon' style={style} viewBox='0 0 1024 1024' version='1.1'
                             xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M511.999488 160.148283c-196.335424 0-353.444491 157.099857-353.444491 353.440398 0 196.339517 157.108044 353.439375 353.444491 353.439375 31.467657 0 58.906562-27.554538 58.906562-58.907586 0-15.762993-3.909026-27.554538-15.64429-39.285709-7.945965-11.794615-15.764016-23.590254-15.764016-39.234544 0-31.467657 27.49928-58.906562 58.907586-58.906562l70.694015 0c109.995073 0 196.342587-86.406866 196.342587-196.394776C865.442956 301.490264 708.393241 160.148283 511.999488 160.148283M296.043211 513.588681c-31.460494 0-58.900423-27.554538-58.900423-58.906562 0-31.408306 27.438905-58.903493 58.900423-58.903493 31.416492 0 58.906562 27.495187 58.906562 58.903493C354.950796 486.034143 327.460726 513.588681 296.043211 513.588681M413.857359 356.483708c-31.467657 0-58.906562-27.49928-58.906562-58.907586 0-31.407282 27.438905-58.906562 58.906562-58.906562 31.408306 0 58.907586 27.49928 58.907586 58.906562C472.765968 328.984428 445.266688 356.483708 413.857359 356.483708M610.199946 356.483708c-31.416492 0-58.906562-27.49928-58.906562-58.907586 0-31.407282 27.49007-58.906562 58.906562-58.906562 31.408306 0 58.900423 27.49928 58.900423 58.906562C669.100369 328.984428 641.609275 356.483708 610.199946 356.483708M728.006931 513.588681c-31.407282 0-58.906562-27.554538-58.906562-58.906562 0-31.408306 27.49928-58.903493 58.906562-58.903493 31.416492 0 58.906562 27.495187 58.906562 58.903493C786.914517 486.034143 759.423423 513.588681 728.006931 513.588681'
                                fill={this.state.fill} />
                        </svg>
                    </li>
                    <li onClick={this.handleClear} style={{float: 'right', marginRight: '15px'}}>
                        <img src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTYwMTM1ODk1MjA5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIwMzMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTk2Ni4xMjggMTgxLjEySDg0MC45NmMtMC4xNjggMC0wLjMyLTAuMDk2LTAuNDg4LTAuMDk2LTAuMTYgMC0wLjMxMiAwLjA5Ni0wLjQ4IDAuMDk2SDE4NC4wNjRjLTAuMTc2IDAtMC4zMi0wLjA5Ni0wLjQ4LTAuMDk2LTAuMTYgMC0wLjMwNCAwLjA5Ni0wLjQ4IDAuMDk2SDU3Ljg3MmEzMi42IDMyLjYgMCAxIDAgMCA2NS4yMDhoOTMuMTA0djY1MS45MjhjMCA2OS4zMiA1Ni4zOTIgMTI1Ljc0NCAxMjUuNzEyIDEyNS43NDRoNDcwLjY4OGM2OS4zMiAwIDEyNS43MTItNTYuNDI0IDEyNS43MTItMTI1Ljc0NFYyNDYuMzI4aDkzLjA0YTMyLjYgMzIuNiAwIDEgMCAwLTY1LjIwOHogbS0xNTguMjU2IDcxNy4xMzZjMCAzMy4zNzYtMjcuMTM2IDYwLjUyOC02MC41MDQgNjAuNTI4SDI3Ni42ODhjLTMzLjM1MiAwLTYwLjQ5Ni0yNy4xNi02MC40OTYtNjAuNTI4VjI0Ni4zMjhoNTkxLjY4djY1MS45Mjh6IiBmaWxsPSIjZmZmZmZmIiBwLWlkPSIyMDM0Ij48L3BhdGg+PHBhdGggZD0iTTM0Ni40ODggODE0Ljc0NGEzMi42MDggMzIuNjA4IDAgMCAwIDMyLjYwOC0zMi42MDhWNDIyLjg4OGEzMi42IDMyLjYgMCAwIDAtNjUuMjE2IDB2MzU5LjI0YTMyLjYgMzIuNiAwIDAgMCAzMi42MDggMzIuNjE2ek01MTIgODE0Ljc0NGEzMi42IDMyLjYgMCAwIDAgMzIuNjA4LTMyLjYwOFY0MjIuODg4YTMyLjYgMzIuNiAwIDAgMC02NS4yMTYgMHYzNTkuMjRBMzIuNiAzMi42IDAgMCAwIDUxMiA4MTQuNzQ0ek02NzcuNTQ0IDgxNC43NDRhMzIuNTg0IDMyLjU4NCAwIDAgMCAzMi42LTMyLjYwOFY0MjIuODg4YzAtMTguMDA4LTE0LjU3Ni0zMi42LTMyLjYtMzIuNnMtMzIuNjA4IDE0LjU5Mi0zMi42MDggMzIuNnYzNTkuMjRhMzIuNTkyIDMyLjU5MiAwIDAgMCAzMi42MDggMzIuNjE2ek0zMTguODQ4IDE1Ny42YTMyLjYwOCAzMi42MDggMCAwIDAgMzIuNjA4LTMyLjZjMC0yMy44MDggNjQuMDQ4LTU5Ljc5MiAxNjAuNTc2LTU5Ljc5MiA5Ni41MTIgMCAxNjAuNTQ0IDM1Ljk4NCAxNjAuNTQ0IDU5Ljc5MmEzMi42IDMyLjYgMCAwIDAgMzIuNjA4IDMyLjYgMzIuNTkyIDMyLjU5MiAwIDAgMCAzMi42LTMyLjZDNzM3Ljc5MiA1My43MzYgNjQwLjczNiAwIDUxMi4wMzIgMCAzODMuMzEyIDAgMjg2LjI0IDUzLjczNiAyODYuMjQgMTI1YTMyLjYwOCAzMi42MDggMCAwIDAgMzIuNjA4IDMyLjZ6IiBmaWxsPSIjZmZmZmZmIiBwLWlkPSIyMDM1Ij48L3BhdGg+PC9zdmc+' />
                    </li>
                </ul>
            </div>
        );
    }
}

export default DotColor;
