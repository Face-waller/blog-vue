<template>
  <el-form :model="commentForm" ref="commentForm" label-width="100px" class="demo-dynamic">
    <el-form-item>
      <el-button @click="commentButton(Date.now())">评论()</el-button>
    </el-form-item>
    <!--输入框-->
    <el-form-item
      v-for="(input, index) in commentForm.inputs"
      :key="input.key"
    >
      <!--输入框-->
      <el-input type="textarea" v-model="input.value"></el-input>
      <!--发表按钮-->
      <el-button type="primary" @click.prevent="commentSub(input)">发表</el-button>
      <!--取消按钮-->
      <el-button @click="canCelComment(input)">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
    export default {
        data() {
            return {
                commentForm: {
                    inputs: [{
                        value: ''
                    }],
                },
                replyForm: {
                    input: [{
                        value: ''
                    }]
                },
            };
        },
        methods: {
            // 发表
            commentSub(input) {
                // 获取输入框文本，获取当前文章id，发起评论请求
                var inputs = this.commentForm.inputs;
                var id = this.$route.query.id;
                if (inputs[0].value.length < 1 || id < 0 || id===null) {
                    // 如果已有输入框实例，删除的，重置
                    inputs.splice(0,this.commentForm.inputs.length);
                }else {

                }

            },
            // 取消
            canCelComment(input) {
                // 如果已有输入框实例，删除掉，重置
                // alert("取消",this.commentForm.inputs.length);
                if (this.commentForm.inputs.length > 0) {
                    this.commentForm.inputs.splice(0,this.commentForm.inputs.length);
                }
                alert(this.commentForm.inputs.length);
            },
            // 评论按钮
            commentButton(date) {
                // 如果已有输入框实例，删除掉，重置
                // alert(this.commentForm.inputs.length);
                if (this.commentForm.inputs.length > 0) {
                    // alert("实例数量大于1");
                    this.commentForm.inputs.splice(0,this.commentForm.inputs.length);
                }else {
                    // 增加评论输入框实例
                    this.commentForm.inputs.push({
                        value:'',
                        key:date,
                    })
                }

            },

        }
    }
</script>
