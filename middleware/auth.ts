export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/user') {
    if (localStorage.getItem('token') === null)
      return '/login'
  }
})
