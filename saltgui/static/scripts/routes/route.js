export class Route {

  constructor(path, name, page_selector, menuitem_selector, router) {
    this.path = new RegExp(path);
    this.name = name;
    this.page_element = document.querySelector(page_selector);
    this.router = router;
    if(menuitem_selector) {
      this.menuitem_element1 = document.querySelector(menuitem_selector + "1");
      this.menuitem_element2 = document.querySelector(menuitem_selector + "2");
    }
  }

  getName() {
    return this.name;
  }

  getPath() {
    return this.path;
  }

  getPageElement() {
    return this.page_element;
  }

  getMenuItemElement1() {
    return this.menuitem_element1;
  }

  getMenuItemElement2() {
    return this.menuitem_element2;
  }

  static _createTd(className, content) {
    const td = document.createElement("td");
    if(className) td.className = className;
    td.innerText = content;
    return td;
  }

  static _createDiv(className, content) {
    const div = document.createElement("div");
    if(className) div.className = className;
    div.innerText = content;
    return div;
  }

  _runCommand(evt, targetString, commandString) {
    this._runFullCommand(evt, "", targetString, commandString);
  }

  _runFullCommand(evt, targettype, targetString, commandString) {
    this.router.commandbox._showManualRun(evt);
    const target = document.querySelector("#target");
    const command = document.querySelector("#command");
    const targetbox = document.querySelector("#targetbox");

    // handle https://github.com/saltstack/salt/issues/48734
    if(targetString === "unknown-target") {
      // target was lost...
      targetString = "";
      targettype = "";
    }
    if(commandString.startsWith("wheel.") && targetString.endsWith("_master")) {
      // target was {hostname}_master...
      // too bad when the real hostname is actually like that :-(
      targetString = "";
      targettype = "";
    }
    if(commandString.startsWith("runners.")) {
      // runners do not have a target, so do not bother
      targetString = "";
      targettype = "";
    }

    if(!targetString) targetString = "";
    if(!commandString) commandString = "";

    if(targettype) {
      let tt = targettype;
      // show the extended selection controls when
      targetbox.style.display = "inherit";
      if(tt !== "glob" && tt !== "list" && tt !== "compound" && tt !== "nodegroup") {
        // we don't support that, revert to standard (not default)
        tt = "glob";
      }
      TargetType.setTargetType(tt);
    }

    target.value = targetString;
    command.value = commandString;
    // the menu may become (in)visible due to content of command field
    this.router.commandbox.cmdmenu.verifyAll();
  }

  _decodeArgumentsText(rawArguments) {
    const rawObject = rawArguments;
    let argumentsText = "";

    switch (typeof rawObject) {
    case "undefined":
      argumentsText = "";
      break;
    case "object": {      
      // object args need special treatment
      const keys = Object.keys(rawObject).sort();
      for(const key of keys) {
        // remove speciall parameters like __kwargs__
        if(!key.includes("__")) {
          argumentsText = argumentsText + key + "=" + rawObject[key];
        }
      }
      break;
    }
    default:
      argumentsText = JSON.stringify(rawObject);
      break;
    }

    return argumentsText;
  }

}
