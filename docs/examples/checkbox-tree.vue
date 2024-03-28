<template>
<div>
    <vl-tree ref="tree" :data="tree" showCheckbox :defaultCheckedKeys="defaultCheckedKeys"></vl-tree>
</div>
</template>
<script>
export default {
    data() {
        return {
            tree: []
        }
    },
    created() {
        this.tree = this.createData(3, 100, 40)
        this.defaultCheckedKeys = [this.tree[0].id]
    },
    mounted() {
        setTimeout(() => {
            this.defaultCheckedKeys.push(this.tree[1].id)
            this.$refs.tree.setCheckedKeys([this.tree[1].id, this.tree[2].id, this.tree[0].id])
        }, 1000)
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
            }
    }
}
</script>