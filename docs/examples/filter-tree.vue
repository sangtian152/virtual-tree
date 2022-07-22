<template>
<div>
    <el-input
        v-model="query"
        placeholder="Please enter keyword"
        @change="onQueryChanged"
    />
  <vl-tree
    ref="treeRef"
    :data="tree"
    :filter-method="filterMethod"
    :height="208"
  />
</div>
  
</template>
<script>
export default {
    data() {
        return {
            tree: [],
            query: ''
        }
    },
    created() {
        this.tree = this.createData(4, 30, 40)
    },
    methods: {
        getKey (prefix, id) {
            return `${prefix}-${id}`
        },
        createData (
        maxDeep,
        maxChildren,
        minNodesNumber,
        deep = 1,
        key = 'node'
    ) {
        let id = 0
        return Array.from({ length: minNodesNumber })
            .fill(deep)
            .map(() => {
            const childrenNumber =
                deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
            const nodeKey = this.getKey(key, ++id)
            return {
                id: nodeKey,
                label: nodeKey,
                children: childrenNumber
                ? this.createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
                : undefined,
            }
            })
        },
        onQueryChanged(query) {
            // TODO: fix typing when refactor tree-v2
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.$refs.treeRef.filter(query)
        },
        filterMethod(query, node) {
            return node.label.includes(query)
        }
    }
}


</script>
