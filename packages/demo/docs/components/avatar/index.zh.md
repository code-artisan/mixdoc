---
title: 头像 Avatar
title_en: Avatar
order: 1
group:
  title: 组件列表
---


## 用法
- 用于标记对象的部分属性和信息



## 常规头像

1. 头像的展示样式一般有圆形或者方形两种
1. 头像支持点击，一般作为编辑个信信息入口


![image.png](./images/1650509636813-278dcd4c-6d68-4008-9d6a-b9518b49159e.png)



## **文字头像** 
在使用文字作为头像时，最多 2 个字符。在整体颜色搭配视觉感官舒适的基础上底色可根据头像颜色自定义。<br />
![image.png](./images/1650509637001-d97551f0-c870-4343-a2a6-942223ebbd74.png)




## 实例
<code src="./example.tsx" />

## API

### Avatar

### size 
按钮类型。

默认值：--

|required|type|platform|
|----|----|----|
|false|`'small' \| 'default' \| 'large'`|Web、iOS、Android|

### text 
头像文本

默认值：--

|required|type|platform|
|----|----|----|
|false|`string`|Web、iOS、Android|

### onPress 
点击回调

默认值：--

|required|type|platform|
|----|----|----|
|false|`() => void`|Web、iOS、Android|


## 主题变量

<div class="theme-variable-table">

| 变量名 | 默认值 | 说明 |
| -------- | -------- | -------- |
| $avatar_border_color | #999 |  头像边框色 |
| $avatar_fill | #ddd |  头像填充色 |
| $avatar_large_size | 96 |  大号尺寸 |
| $avatar_default_size | 88 |  默认尺寸 |
| $avatar_small_size | 80 |  小号尺寸 |

</div>
