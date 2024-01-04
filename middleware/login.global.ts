export default defineNuxtRouteMiddleware((to, _) => {
  if (to.path.startsWith('/user/') || to.path === '/createAndCharge' || to.path === '/notice') {
    if (localStorage.getItem('accessToken') === null)
      return '/login'
  }
})
