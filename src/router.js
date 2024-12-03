import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './components/Home.vue';
import SinglePost from './components/SinglePost.vue';
// import Author from './components/Author.vue';
import BlogListing from './components/BlogListing.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import AddPost from './components/AddPost.vue';
import EditPost from './components/EditPost.vue';
import BlogPost from './components/BlogPost.vue';
import Post from './components/Post.vue';

const routes =  [
  {
    path: '/',
    redirect: '/Home', // Điều hướng mặc định về /Home
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home, // Component hiển thị ở trang chủ
    // meta: { requiresAuth: true }, // Đánh dấu cần đăng nhập
  },
  {
    path: '/Post',
    name: 'Post',
    component: Post,
    meta: { requiresAuth: true }, // Đánh dấu cần đăng nhập
  },
  {
    path: '/Singlepost',
    name: 'Singlepost',
    component: SinglePost,
    meta: { requiresAuth: true }, // Đánh dấu cần đăng nhập
  },
  // {
  //   path: '/Author',
  //   name: 'Author',
  //   component: Author,
  //   meta: { requiresAuth: true }, // Đánh dấu cần đăng nhập
  // },
  {
    path: '/BlogListing',
    name: 'BlogListing',
    component: BlogListing,
    meta: { requiresAuth: true }, // Đánh dấu cần đăng nhập
  },
  {
    path: '/Addpost',
    name: 'Addpost',
    component: AddPost,
    meta: { requiresAuth: true }, // Đánh dấu cần đăng nhập
  },
  {
    path: '/Editpost/:key',
    name: 'Editpost',
    component: EditPost,
    props: true,
    meta: { requiresAuth: true }, // Đánh dấu cần đăng nhập
  },
  {
    path: '/Blogpost/:key',
    name: 'Blogpost',
    component: BlogPost,
    props: true,
    //  meta: { requiresAuth: true }, // Đánh dấu cần đăng nhập
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
];


const router = createRouter({
  history: createWebHashHistory ('/asm'),
  routes,
});

// Navigation Guard kiểm tra trạng thái đăng nhập
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('username'); // Kiểm tra trạng thái đăng nhập từ localStorage

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Nếu trang yêu cầu đăng nhập và chưa đăng nhập, chuyển hướng tới /login
    next('/login');
  } else {
    // Cho phép truy cập
    next();
  }
});

export default router;
