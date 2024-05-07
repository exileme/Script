// ==UserScript==
// @name         流放之路POESESSID&PUIN复制
// @namespace    http://tampermonkey.net/
// @version      2024-04-10
// @description  try to take over the world!
// @author       You
// @match        https://poe.game.qq.com/my-account
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://unpkg.com/cn-poe-translator@0.2.8/dist/translator.global.js
// @require      https://unpkg.com/cn-poe-export-db@0.1.5/dist/db.global.js
// @require      https://unpkg.com/pob-building-creater@0.1.3/dist/creater.global.js
// @require      https://unpkg.com/pako@2.1.0/dist/pako_deflate.min.js
// @require      https://unpkg.com/axios@1.6.3/dist/axios.min.js
// @require      https://unpkg.com/vue@3.3.2/dist/vue.global.prod.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function(){
  const { defineComponent, ref, reactive, openBlock, createElementBlock, Fragment, createElementVNode,   pushScopeId, popScopeId, createBlock, createApp } = Vue;

  (function() {
    "use strict";
    try {
      if (typeof document != "undefined") {
        var elementStyle = document.createElement("style");
        elementStyle.appendChild(document.createTextNode("#exportPoesessid {\n  position: fixed;\n  bottom: 120px;\n  left: 10px;\n  z-index: 99999;\n}\n\n.line-container[data-v-f270e9z2] {\n  display: flex;\n  margin: 3px 0;\n  min-height: 25px;\n}\n.line-container select[data-v-f270e9z2] {\n  min-height: 25px;\n  margin-right: 4px;\n  min-width: 100px;\n}\n.line-container input[data-v-f270e9z2] {\n  margin-right: 4px;\n}"));
        document.head.appendChild(elementStyle);
      }
    } catch (e) {
      console.error("vite-plugin-css-injected-by-js", e);
    }
  })();
  const _withScopeId = (n) => (pushScopeId("data-v-f270e9z2"), n = n(), popScopeId(), n);
  const _hoisted_1 = { class: "line-container" };
  const _hoisted_2 = ["value"];
  const _hoisted_3 = ["disabled"];
  const _hoisted_0_0 = ["disabled"];
  const realm = "pc";
  const _sfc_main$1 = /* @__PURE__ */ defineComponent({
    __name: "Exporter",
    props: ["createBuilding", "startup"],
    setup(__props) {
      const props = __props;
      const buildingCode = ref("");
      const state = reactive({
        buildingCode
      });
      function getCookieValue(key) {
          // 将document.cookie字符串按照; 分割成数组
          var cookies = document.cookie.split(';');
          // 遍历cookie数组，并且对每个cookie键值对进行分割
          for (var i = 0; i < cookies.length; i++) {
              var cookiePair = cookies[i].split('=');
              // 移除cookie名称两边的空格
              var cookieName = cookiePair[0].trim();
              // 如果当前cookie的名称与要查找的名称相同
              if (cookieName === key) {
                  // 返回cookie的值，并去除前面的空格
                  return cookiePair[1] ? cookiePair[1].trim() : null;
              }
          }
          // 如果没有找到，返回null
          return null;
      }
        var value;
      function handleUnion(){
          // 获取POESESSID 以及 p_uin
          value = getCookieValue('POESESSID') + ";p_uin=" + getCookieValue('p_uin');
          state.buildingCode = value;
      }
      function handleCopies() {
          //文本添加到复制中
        navigator.clipboard.writeText(value);
      }
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock(Fragment, null, [
          createElementVNode("span", _hoisted_1, [
            createElementVNode("input", {
              disabled: "",
              maxlength: "50",
              value: state.buildingCode
            }, null, 8, _hoisted_2),
            createElementVNode("button", {
              onClick: handleUnion,
            }, "获取", 8, _hoisted_0_0),
            createElementVNode("button", {
              onClick: handleCopies,
            //  disabled: state.buildingCode.length === 0
            }, "复制", 8, _hoisted_3)
          ])
        ], 64);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const Exporter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f270e9z2"]]);
  const _sfc_main = /* @__PURE__ */ defineComponent({
    __name: "Monkey",
    setup(__props) {
      const factory = new CnPoeTranslator.BasicTranslatorFactory(CnPoeExportDb);
      const jsonTranslator = factory.getJsonTranslator();
      async function createBuilding(items, passiveSkills) {
        const code = btoa(String.fromCharCode(...compressed)).replaceAll("+", "-").replaceAll("/", "_");
        return code;
      }
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Exporter, { "create-building": createBuilding });
      };
    }
  });
  const container = document.createElement("div");
  container.id = "exportPoesessid";
  document.body.appendChild(container);
  createApp(_sfc_main).mount("#exportPoesessid");

  })();
