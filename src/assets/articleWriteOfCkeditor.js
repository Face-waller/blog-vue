/**
 *原jsp文件内已使用此压缩版本的js
 */
$(function () {
    /*加载CKEditor*/
    /*if (typeof CKEDITOR=='undefined'){
        console.log('Editor load failed!');
    }else{
        CKEDITOR.replace('editor01');
        console.log('Editor loaded!')
    }*/

    // 谷歌高亮代码样式
    prettyPrint();

    // 页面聚焦文本输入框
    document.getElementById("title").focus();

    // 发表按钮点击事件
    $('.pubbtn').click(function () {
        //是发表按钮不可用
        $('.pubbtn').attr("disabled",true);
        //获取数据
        var title = $('#title').val();
        var describe = $('#describe').val();
        var artype = $('.artype').val();
        //获取富文本内容
        var detail = CKEDITOR.instances.editor01.getData();
        //组织数据
        params = {'title': title,'describe':describe,'arType':artype,'detail':detail};
        articlecommit_error = false;
        $.ajaxSettings.async = false;
        try {
            //发起ajax post请求
            $.post('api.blogll.cn/article/articleWrite',params,function (data) {
                if(data.res == 2){
                    //文章发表成功
                    articlecommit_error = false;
                }
                else{
                    //文章发表失败
                    articlecommit_error = true;
                    //输出发表结果
                    alert(data.errmsg);
                }
                //设置发表按钮可用
                $('.pubbtn').attr("disabled",false);
            });
        }catch (e) {
            e.print();
            articlecommit_error = true;
        }finally {
            $.ajaxSettings.async = true;
        }
        //判断文章是否发表成功,发表成功刷新界面
        if(articlecommit_error == false){
            alert("您已发表成功！")
        }
        //设置发表按钮可用
        $('.pubbtn').attr("disabled",false);
    });
});



