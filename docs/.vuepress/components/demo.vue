<template>
    <demo-block :demos="demos" :source="source" :path="path" :raw-source="rawSource" :description="description">`
    </demo-block>
</template>
<script>
import DemoBlock from './demo-block.vue'
export default {
    components: {
        DemoBlock
    },
    props: {
        source:String,
        path: String,
        rawSource: String,
        description: String
    },
    created() {
    },
    data() {
        const files = require.context('../../examples/', false, /\.vue$/)
        const demos = {};
        files.keys().forEach((key) => {
            if (key === './index.js') { return; }
            demos[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default;
        });
        return {
            demos,
        }
    },
}
</script>