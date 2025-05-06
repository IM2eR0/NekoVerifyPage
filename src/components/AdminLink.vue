<template>
  <q-item clickable to="admin">
    <q-item-section avatar>
      <q-icon name="mdi-shield-crown-outline" />
    </q-item-section>

    <q-item-section>
      <q-item-label>管理员</q-item-label>
    </q-item-section>
  </q-item>
  <q-item clickable to="webhooks">
    <q-item-section avatar>
      <q-icon name="mdi-webhook" />
    </q-item-section>

    <q-item-section>
      <q-item-label>WebHooks</q-item-label>
    </q-item-section>
  </q-item>
  <q-item clickable to="userslist">
    <q-item-section avatar>
      <q-icon name="mdi-list-box-outline" />
    </q-item-section>

    <q-item-section>
      <q-item-label>用户列表</q-item-label>
    </q-item-section>
  </q-item>
</template>