<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div id="root" :class="{ dark: isDarkMode }">
    <div class="content-wrapper max-w-screen-2xl text-base mx-auto px-8">
      <header class="pt-8 pb-12 mx-10">
        <nav class="flex flex-row justify-between items-center px-6">
          <!-- Logo -->
          <div class="logo text-center font-semibold cursor-pointer flex items-center">
            <img src="./img/logo_2.png" class="h-9 w-70 ml-4" alt="Logo" />
          </div>

          <!-- Menu -->
          <ul id="cus-top-menu" class="hidden lg:flex lg:items-center lg:gap-9 text-md text-gray-500 font-bold">
            <li v-if="isLoggedIn" class="cus-top-menu-item">
              <router-link to="/Home">Home</router-link>
            </li>
            <li v-if="isLoggedIn" class="cus-top-menu-item">
              <router-link to="/Post">Post</router-link>
            </li>
            <li v-if="isLoggedIn" class="cus-top-menu-item">
              <router-link to="/BlogListing">Blog Listing</router-link>
            </li>
            <li v-if="isLoggedIn" class="cus-top-menu-item">
              <router-link to="/Singlepost">Single Post</router-link>
            </li>
            <!-- <li v-if="isLoggedIn" class="cus-top-menu-item">
              <router-link to="/Author">Author</router-link>
            </li> -->
            <li v-if="!isLoggedIn" class="cus-top-menu-item">
              <router-link to="/register">Register</router-link>
            </li>
            <li v-if="!isLoggedIn" class="cus-top-menu-item">
              <router-link to="/login">Login</router-link>
            </li>
          </ul>

          <!-- Search and Dark Mode Toggle -->
          <div class="flex items-center gap-x-4">
            <!-- Thanh tìm kiếm -->
            <div v-if="isLoggedIn" class="relative flex items-center">
              <input type="text" v-model="searchQuery" placeholder="Search for posts..."
                class="w-full px-5 py-3 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500" />
              <button @click="searchPosts"
                class="absolute right-2 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6a4 4 0 110 8 4 4 0 010-8zm8 14l-4-4" />
                </svg>
              </button>
            </div>
            <!-- Modal hiển thị kết quả -->
            <div v-if="showModal" class="modal-backdrop">
              <div class="modal-content">
                <!-- Header của modal -->
                <div class="flex justify-between items-center">
                  <h2 class="text-2xl font-bold">Kết quả tìm kiếm</h2>
                  <button @click="closeModal"
                    class="text-red-500 hover:text-red-700 transition-colors text-xl font-bold" aria-label="Close">
                    &times;
                  </button>
                </div>
                <!-- Nội dung của modal -->
                <ul v-if="filteredPosts.length">
                  <li v-for="(post, index) in filteredPosts" :key="index" @click="goToPost(post.key)"
                    class="cursor-pointer hover:underline text-blue-600 mt-3">
                    <h3 class="font-bold">{{ post.title }}</h3>
                    <p class="italic">Danh mục: {{ post.category }}</p>
                  </li>
                </ul>
                <p v-else class="text-red-500 font-bold py-3">Không có bài viết</p>
              </div>
            </div>



            <!-- Dark Mode Toggle -->
            <div class="relative w-12 h-6 bg-gray-300 rounded-full cursor-pointer flex items-center px-1"
              @click="toggleDarkMode">
              <div
                class="absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform flex items-center justify-center"
                :class="{ 'translate-x-6': isDarkMode }">
                <img v-if="isDarkMode" src="./img/moon.svg" alt="Dark Mode" class="w-3 h-3" />
                <img v-else src="./img/sunny.svg" alt="Light Mode" class="w-3 h-3" />
              </div>
            </div>

            <!-- User Info and Logout -->
            <div v-if="isLoggedIn" class="flex items-center gap-x-4">
              <p class="text-blue-600">Hello, {{ username }}!</p>
              <button @click="logoutUser" class="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>

    <div class="content-wrapper max-w-screen-2xl text-base mx-auto px-8">
      <router-view></router-view>
    </div>
  </div>
  <footer class="bg-gray-100">
    <div class="mx-auto w-full max-w-screen-xl p-10 py-6 lg:py-8">
      <div class="md:flex md:justify-between">
        <div class="mb-6 sm:mr-16  md:mb-0">
          <a href="#" class="flex items-center">
            <img src="./img/logo_2.png" class="h-8 me-3" alt="" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-bl">MetaBlog</span>
          </a>
        </div>
        <div class="grid grid-cols-3 gap-8 sm:gap-6 lg:grid-cols-3">
          <div class="w-80">
            <h2 class="mb-3 text-lg font-semibold text-gray-900">About</h2>
            <ul class="text-gray-500 dark:text-gray-400 font-sans w-48">
              <li class="mb-4">
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at nisi lorem.
                  Nullam fringilla
                  efficitur orci, ac molestie nulla tempus ac. </span>
              </li>
              <li>
                <span class="text-black font-semibold bg-opacity-30">Email : </span>
                <span>info@gmail.com</span>
                <br>
                <span class="text-black font-semibold bg-opacity-30">Phone : </span>
                <span>880 123 456 789</span>
              </li>
            </ul>
          </div>
          <div class="sm:ml-10">
            <h2 class="mb-3 text-lg font-semibold text-gray-900  ">Follow us</h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
              <li class="">
                <a href="#" class="hover:underline ">Home</a>
              </li>
              <li>
                <a href="#" class="hover:underline">About</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Blog</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Archived</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Athor</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-3 text-lg font-semibold text-gray-900  ">Legal</h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
              <li class="">
                <a href="#" class="hover:underline">Lifestyle</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Technology</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Travel</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Business</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Economy</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Sports</a>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="#"
            class="hover:underline">MetaBlog™</a>. All Rights Reserved.
        </span>
        <div class="flex mt-4 sm:justify-center sm:mt-0">
          <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <span class="">Terms of Use</span>
          </a>
          <span></span>
          <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
            <span class="">Privacy Policy</span>
          </a>
          <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
            <span class="">CookiePolicy</span>
          </a>

        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      posts: [], // Mảng bài viết từ localStorage
      filteredPosts: [],
      showModal: false,
      isDarkMode: false,
      isLoggedIn: false,
      username: ''
    };
  },
  created() {
    const username = localStorage.getItem('username');
    if (username) {
      this.isLoggedIn = true;
      this.username = username; // Set username
    }
  },
  methods: {
    // Lấy danh sách bài viết từ localStorage
    loadPosts() {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('post_'));
      this.posts = keys.map(key => JSON.parse(localStorage.getItem(key)));
    },
    // Xử lý tìm kiếm
    searchPosts() {
      // Lấy tất cả bài viết từ localStorage
      this.posts = Object.keys(localStorage)
        .filter((key) => key.startsWith('post_')) // Lọc bài viết theo key bắt đầu bằng 'post_'
        .map((key) => ({ key, ...JSON.parse(localStorage.getItem(key)) })); // Thêm key vào object bài viết

      // Lọc bài viết theo tiêu đề
      this.filteredPosts = this.posts.filter((post) =>
        post.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      // Hiển thị modal
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    goToPost(key) {
      // Điều hướng đến trang BlogPost
      this.$router.push({ path: `/blogpost/${key}` });
      this.closeModal();
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.classList.toggle('dark', this.isDarkMode);
      localStorage.setItem('darkMode', this.isDarkMode);
    },
    logoutUser() {
      localStorage.removeItem('username'); // Xóa thông tin đăng nhập
      this.isLoggedIn = false;
      this.username = '';
      this.$router.push('/login');
      alert('Bạn đã đăng xuất thành công!');
    }
  },
  mounted() {
    this.loadPosts(); // Tải bài viết khi ứng dụng khởi động
    const savedMode = localStorage.getItem('darkMode') === 'true';
    this.isDarkMode = savedMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }
};
</script>

<style>
html.dark {
  background-color: #21253c;
  color: #ffffff;
}

html {
  background-color: #ffffff;
  color: #000000;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /* Đảm bảo modal ở trên cùng */
}

.modal-content {
  position: relative;
  /* Đảm bảo modal nội dung theo modal-backdrop */
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  z-index: 10000;
  /* Nội dung modal cao hơn backdrop */
}
</style>
