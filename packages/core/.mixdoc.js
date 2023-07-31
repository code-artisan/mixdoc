module.exports = () => {
  return {
    // 你可以把组件的设计文档存放在雨雀上，然后配置以下信息授权给 mixdoc 进行拉取设计文档的内容。
    // token: 'xxx',
    // namespace: 'foo/bar',
    directory: 'docs/components',
    // 组件库的源码目录，需要真实安装对应的组件库，以保证生成的文档内容跟实际的 API 之类的一致。
    workspace: path.resolve(__dirname, 'node_modules/@mixdoc/ui/lib'),
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
      filepath: 'style/theme.ts',
    },
    property: {
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
