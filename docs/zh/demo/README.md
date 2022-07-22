# 虚拟化树形控件

## 基础用法

基础的树形结构展示

:::demo

base-tree

:::



## 可选择的虚拟树

适用于需要选择层级时使用。

:::demo

checkbox-tree

:::


## 节点过滤

在需要对节点进行过滤时，调用 Tree 实例的 filter 方法， 参数为关键字。 需要注意的是，此时需要设置 filter-method，值为过滤函数。

:::demo

filter-tree

:::



## Attributes

| Attribute             | Description                                                                                                                                  | Type                  | Default |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------- |
| data                  | 展示数据                                                                                                                                    | array                 | —       |
| empty-text            | 内容为空的时候展示的文本                                                                                                             | string                | —       |
| props                 | 配置选项，具体看下表                                                                                               | object                | —       |
| highlight-current     | 是否高亮当前选中节点                                                                                                          | boolean               | false   |
| expand-on-click-node  | 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点   | boolean               | true    |
| check-on-click-node   | 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点 | boolean               | false   |
| default-expanded-keys | 默认展开的节点的 key 的数组                                                                                                    | array                 | —       |
| show-checkbox         | 节点是否可被选择                                                                                                               | boolean               | false   |
| check-strictly        | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false                                        | boolean               | false   |
| default-checked-keys  | 默认勾选的节点的 key 的数组                                                                                                     | array                 | —       |
| current-node-key      | 当前选中的节点                                                                                                               | string, number        | —       |
| filter-method         | 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示， 返回 false 则表示这个节点会被隐藏                            | Function(value, data) | —       |
| indent                |相邻级节点间的水平缩进，单位为像素                                                                                 | number                | 16      |
| icon                  | 自定义树节点的图标                                                                                                                       | string / Component    | -       |

## props

| Attribute | Description                                                                          | Type           | Default  |
| --------- | ------------------------------------------------------------------------------------ | -------------- | -------- |
| value     | 每个树节点用来作为唯一标识的属性，在整棵树中应该是唯一的 | string, number | id       |
| label     | 指定节点标签为节点对象的某个属性值                         | string         | label    |
| children  | 指定子树为节点对象的某个属性值                              | string         | children |
| disabled  | 指定节点选择框是否禁用为节点对象的某个属性值 disabled           | string         | disabled |

## Method

Tree内部使用TreeNode类型的对象来包装用户传入的数据，用来构造树节点之间的关系。 Tree 暴露了以下方法：
| Method | Description | Parameters |
| --------------- | ---------------------------------------- | ---------------------------------------- |
| filter | 对树节点进行筛选操作 | `(query: string)` |
| getCheckedNodes | 若节点可被选择（即show-checkbox为 true），则返回目前被选中的节点所组成的数组 | `(leafOnly: boolean)` |
| getCheckedKeys | 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组 | `(leafOnly: boolean)` |
| setCheckedKeys | 通过 keys 设置目前勾选的节点 | `(keys: TreeKey[])` |
| setChecked | 通过 key 设置某个节点的勾选状态 | `(key: TreeKey, checked: boolean)` |
| getHalfCheckedNodes | 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组 | - |
| getHalfCheckedKeys | 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组 | - |
| getCurrentKey | 获取当前被选中节点的 key，若没有节点被选中则返回 undefined | - |
| getCurrentNode | 获取当前被选中节点的 data，若没有节点被选中则返回 undefined | - |
| setCurrentKey | 通过 key 设置某个节点的当前选中状态 | `(key: TreeKey)` |
| setData | 设置空间数据 | `(data: TreeData)` |

## Events

| Event Name       | Description                                          | Parameters                                                                                                                              |
| ---------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| node-click       | 当节点被点击的时候触发                      | `(data: TreeNodeData, node: TreeNode, e: MouseEvent)`                                                                                   |
| node-contextmenu | 当节点被鼠标右键点击时会触发该事件      | `(e: Event, data: TreeNodeData, node: TreeNode)`                                                                                        |
| check-change     | 节点选中状态发生变化时的回调 | `(data: TreeNodeData, checked: boolean)`                                                                                                |
| check            | 当复选框被点击的时候触发       | `(data: TreeNodeData, info: { checkedKeys: TreeKey[],checkedNodes: TreeData, halfCheckedKeys: TreeKey[], halfCheckedNodes: TreeData,})` |
| current-change   | 当前选中节点变化时触发的事件                   | `(data: TreeNodeData, node: TreeNode)`                                                                                                  |
| node-expand      | 节点被展开时触发的事件                      | `(data: TreeNodeData, node: TreeNode)`                                                                                                  |
| node-collapse    | 节点被收起时触发的事件                     | `(data: TreeNodeData, node: TreeNode)`                                                                                                  |

## Slots

| Name | Description                                                                                    |
| ---- | ---------------------------------------------------------------------------------------------- |
| -    | 自定义树节点的内容。 作用域参数为 { node: TreeNode, data: TreeNodeData } |
