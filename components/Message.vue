<template>
  <div>
    <div v-if="name === 'admin'" class="system">
      <p class="text-center font-italic">{{ text }}</p>
    </div>
    <div v-else class="msg-wrapper">
      <div class="msg" :class="{owner}">
        <div class="msg__information">
          <span class="msg__name">{{ name }}</span>
          <span class="msg__date">{{ time }}</span>
        </div>
        <p class="msg__text">{{ text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    text: String,
    time: String,
    owner: Boolean
  }
};
</script>

<style lang="scss" scoped>
.system {
  margin-bottom: 1rem;
  color: #fff;

  p {
    margin-bottom: 1rem;
  }
}

.msg-wrapper{
  display: flex;
  flex-direction: column;
}

.msg {
  padding: 1rem;
  width: 60%;
  margin: 0 1rem;
  box-shadow: 0 1px 0 0 rgba(50, 50, 50, 0.3);
  border-radius: 4px;
  background: #1976d2;
  color: #fff;
  position: relative;
  word-break: break-all;
  margin-bottom: 1rem;

  &__information {
    display: flex;
    justify-content: space-between;
  }

  &__name {
    font-weight: 700;
  }

  &__date {
    text-decoration: underline;
    margin-left: 15px;
  }

  &__text {
    margin-bottom: 0;
  }
}

.owner {
  background: #fff;
  color: #000;
  align-self: flex-end;
}
</style>