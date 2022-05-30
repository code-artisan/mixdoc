# mixdoc
一款用于生成组件库文档的工具。

## 诞生背景
现在市场上充斥着各种各样的组件库，很多公司也都是有内部的组件库，这本身是很好的现象，但它们似乎都面临相同的问题：需要手动补充各个组件的 API 文档或者是设计文档。因此开发出 `laybug` 这款工具来尝试解决这些问题。

## 如何安装
npm

```bash
$ npm i @mixdoc/cli
```

yarn
```bash
$ yarn i @mixdoc/cli
```

## 如何使用
在正式开始之前我们需要先看一下该如何配置。

首先你需要在文档工程的根目录新建一个 `.mixdoc.js` 文件来作为它的配置文件：
```js
module.exports = () => {
  return {
    // 你可以把组件的设计文档存放在雨雀上，然后配置以下信息授权给 mixdoc 进行拉取设计文档的内容。
    // token: 'xxx',
    // namespace: 'foo/bar',
    directory: 'docs/components',
    // 组件库的源码目录，需要真实安装对应的组件库，以保证生成的文档内容跟实际的 API 之类的一致。
    libSourceCodeWorkspace: '@terminus/nusi-pos/lib',
    // 组件列表
    components: [
      // ...
      // {
      //   name: 'button', // 组件名称
      //   slug: 'xxx', // 雨雀文档的 slug，如：https://www.yuque.com/foo/bar/xraik9 中的 xraik9
      // }
      // ...
    ],
    // 非标准的工程结构下可以用来自定义读取原文档模板内容，需返回 promise / buffer / string
    // originDocumentReader() {},
    theme: {
      // 主题变量的文件路径（目前仅支持 { key: value } 的情况，less / sass 的后面支持）
      filepath: 'style/theme.ts',
    },
    property: {
      // 组件属性的文件路径
      filepath: 'interface.ts',
    },
    // 是否需要将设计文档中的图片转成本地图片，默认为 true
    shouldReplaceRemoteImageSourceToLocale: true,
    output: {
      // 图片输出目录，仅 shouldReplaceRemoteImageSourceToLocale 为 true 时有效
      image: 'images',
      markdown: 'index.zh.md',
    },
    // 当获取设计文档的内容时，会触发此回调
    onFetchDesignDraft() {},
    // 当扫描完组件的属性文档，会触发此回调
    onFetchComponentProperty() {},
    // 当扫描完组件的主题变量时，会触发此回调
    onFetchComponentThemeVariable() {},
    // 构建失败时的回调
    onError() {},
    // 构建成功时的回调
    onSuccess() {},
    // 构建成功或失败都会调用的回调
    onComplete() {},
  };
};
```

除了上面的配置文件之外，你需要干一件事情：将组件属性和主题变量都写上对应的注释，其中主题变量只需要正常写注释即可，而组件属性的文档就要相对麻烦一些，下面列举除了它的语法：

```typescript
export default ButtonInterface {
  /**
   * 按钮类型。
   * primary 主要
   * secondary 二级按钮
   * minor 次级按钮
   * ghost 幽灵按钮
   * text 文本按钮
   * @default primary // 默认值
   * @platform Web、微信小程序 // 适配平台（看实际是否需要）
   */
  type?: 'primary' | 'secondary' | 'minor' | 'ghost' | 'text',

  /**
   * @ingore // 表示忽略，将不会在文档中生成该属性。
   */
  children: React.ReactElement
}
```

另外还需要保证在 `directory` 的目录中，在对应组件的目录下存放 `.template.md` 文件，其中的内容也需要包含对应的标记：
1. \<!-- design-doc --> --> 设计文档的标记，最终会替换成对应的设计文档的内容；
2. \<!-- api-doc --> --> 组件属性的标记，最终会替换成对应的组件属性的内容；
3. \<!-- theme-doc --> --> 主题变量的标记，最终会替换成对应的主题变量的内容；

按照以上的步骤配置之后，你终于可以在 `package.json` 中添加一些 script 来调用它了：

```json
  {
    "scripts": {
      "build:docs": "laybug build"
    }
  }
```
