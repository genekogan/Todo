const TabGroup = require("electron-tabs");

let tabGroup = new TabGroup();

tabGroup.addTab({
  title: "Todo",
  src: "http://localhost:62991",
  closable: false,
  active: true
});

tabGroup.addTab({
  title: "Calendar",
  src: "https://calendar.google.com",
  visible: true,
  closable: false,
  active: false
});