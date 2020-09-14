/* eslint-disable */


class ProtocolCheck {
	constructor(uriName) {
		this.uriName = uriName;
		this.uri = uriName + '://';
	}

	openUri(callback) {
		if (!callback) {
			return;
		}

		if (navigator.msLaunchUri) { //for IE and Edge in Win 8 and Win 10
			this.openUriWithMsLaunchUri(this.uri, callback);
		} else {
			var browser = this.checkBrowser();
	
			if (browser.isFirefox) {
				this.openUriUsingFirefox(this.uri, callback);
			} else if (browser.isChrome || browser.isElectron) { // ÀëÏß°æ
				this.openUriWithTimeoutHack(this.uri, callback);
			} else if (browser.isIE) {
				this.openUriUsingIEInOlderWindows(this.uri, callback);
			} else {
				//not supported, implement please
				callback(false);
			}
		}
	}



	checkBrowser() {
		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		return {
			isOpera   : isOpera,
			isFirefox : typeof InstallTrigger !== 'undefined',
			isSafari  : Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
			isChrome  : !!window.chrome && !isOpera,
			isElectron: navigator.userAgent.toLowerCase().includes("electron"), // ÊÇ·ñÀëÏß°æ
			isIE      : /*@cc_on!@*/false || !!document.documentMode // At least IE6
		}
	}

	openUriWithMsLaunchUri(uri, callback) {
		navigator.msLaunchUri(uri,
			() => { callback(true) },
			() => { callback(false) }
			);
	}

	openUriUsingFirefox(uri, callback) {
		var iframe = document.querySelector("#hiddenIframe");
	
		if (!iframe) {
			iframe = _createHiddenIframe(document.body, "about:blank");
		}
	
		try {
			iframe.contentWindow.location.href = uri;
			callback(true);
		} catch (e) {
			if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
				alert("Un Kown!")
				callback(false);
			}
		}
	}

	openUriWithTimeoutHack(uri, callback) {

		var timeout = setTimeout(function () {
			callback(false);
			handler.remove();
		}, 1000);

		//handle page running in an iframe (blur must be registered with top level window)
		var target = window;
		while (target != target.parent) {
			target = target.parent;
		}

		var handler = this._registerEvent(target, "blur", onBlur);

		function onBlur() {
			clearTimeout(timeout);
			handler.remove();
			callback(true);
		}

		window.location = uri;
	}

	openUriUsingIEInOlderWindows(uri, callback) {
		if (getInternetExplorerVersion() === 10) {
			this.openUriUsingIE10InWindows7(uri, callback);
		} else if (getInternetExplorerVersion() === 9 || getInternetExplorerVersion() === 11) {
			this.openUriWithIE11UsingRegistry(uriName, uri,callback);
		} else {
			this.openUriInNewWindowHack(uri, callback);
		}
	}

	openUriUsingIE10InWindows7(uri, callback) {
		var timeout = setTimeout(() => {
			callback(false);
		}, 6000);
		window.addEventListener("blur", function () {
			clearTimeout(timeout);
			callback(true);
		});
	
		var iframe = document.querySelector("#hiddenIframe");
		if (!iframe) {
			iframe = this._createHiddenIframe(document.body, "about:blank");
		}
		try {
			iframe.contentWindow.location.href = uri;
		} catch (e) {
			callback(false);
			clearTimeout(timeout);
		}
	}

	openUriWithIE11UsingRegistry(uriName, uri,callback){
		var shell = new ActiveXObject("WScript.shell");
		try{
			var reg=shell.RegRead("HKEY_CLASSES_ROOT\\" + uriName +"\\URL Protocol");
			if(reg){
				console.log(reg);
				window.location.href=uri;
			}
			callback(true);
		}catch(e){
			callback(false);
		}
		
	}

	openUriInNewWindowHack(uri, callback) {
		var myWindow = window.open('', '', 'width=0,height=0');
	
		myWindow.document.write("<iframe src='" + uri + "'></iframe>");
	
		setTimeout(function () {
			try {
				myWindow.location.href;
				myWindow.setTimeout("window.close()", 1000);
				callback(true);
			} catch (e) {
				myWindow.close();
				callback(false);
			}
		}, 1000);
	}

	_createHiddenIframe(target, uri) {
		var iframe = document.createElement("iframe");
		iframe.src = uri;
		iframe.id = "hiddenIframe";
		iframe.style.display = "none";
		target.appendChild(iframe);

		return iframe;
	}

	_registerEvent(target, eventType, cb) {
		if (target.addEventListener) {
			target.addEventListener(eventType, cb);
			return {
				remove: function () {
					target.removeEventListener(eventType, cb);
				}
			};
		} else {
			target.attachEvent(eventType, cb);
			return {
				remove: function () {
					target.detachEvent(eventType, cb);
				}
			};
		}
	}
}

export default ProtocolCheck;