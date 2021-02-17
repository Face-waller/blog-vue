<!-- Menu -->

<template>
  <ul class="wrapper">
    <!-- 遍历 router 菜单数据 -->
    <Menuitem :key="index" v-for="(item, index) in router">
      <!-- 对于没有 children 子菜单的 item -->
      <a class="liCss" v-if="!item.children" style="text-decoration: none;" :href="item.href" :title="item.title">{{item.title}}</a>

      <!-- 对于有 children 子菜单的 item -->
      <template v-else>
        <a class="liCss" style="text-decoration: none" :href="item.href" :title="item.title">{{item.title}}</a>
        <!-- 递归操作 -->
        <Menu :router="item.children" ></Menu>
      </template>
    </Menuitem>
  </ul>
</template>

<script>

    export default {
        name: "Menu",
        props: ["router"], // Menu 组件接受一个 router 作为菜单数据
        data() {
            return {

            };
        },
        methods: {

        }
    };
</script>
<style>
  .liCss{
    color: black;
    text-decoration: none;
    /*white-space: nowrap;*/
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    font-size: 1.167rem;
  }
  .liCss:hover{
    color: #9fcdff;
  }
</style>
