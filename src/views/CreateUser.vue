<script setup>

</script>

<template>
  <div class="user-login container w-75 mt-5">
    <h3>Login</h3>
    <form>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<style>
@media (max-width: 430px) {
  .user-login {
    width: 75%;
  }
}

@media (min-width: 1024px) {
  .user-login {
    width: 30%;
  }
}
</style>