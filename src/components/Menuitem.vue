// Menuitem

<template>
  <li class="item">
    <slot />
  </li>
</template>
<style>
  .item{
    display: list-item;
    list-style-type: square;
    border-bottom: 4px solid #666;
    /*border-width: 4px;*/
  }
  .item:last-child {
    border-bottom: none;
  }
</style>
