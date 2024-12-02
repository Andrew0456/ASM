<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="container mx-auto my-5 px-4">

      <!-- Title -->
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Blog - Bài Viết Mới Nhất</h2>
      <!-- Nut Add Post -->
      <router-link to="/addpost"
        class="block w-full sm:w-auto mx-auto text-center px-5 py-3 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md mb-8">
        Thêm Bài Viết Mới
      </router-link>
      <!-- Responsive Grid for Blog Posts \ can chinh res -->
      <div class="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

        <!-- Single Blog Post Card -->
        <div v-for="(post, key) in posts" :key="key"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out ">

          <!-- Click vao Post Image and Title -->
          <router-link :to="`/blogpost/${key}`" class="block relative">
            <img v-if="post.image" :src="post.image" :alt="post.title"
              class="w-full h-56 object-fill transition-transform duration-300 ease-in-out transform hover:scale-105">
            <!-- object-cover   full man  hinh -->
            <div class="absolute bottom-0 left-0 w-full p-3 text-sm text-white bg-black bg-opacity-40">
      <p>{{ post.date }}</p>
    </div>

          </router-link>

          <!-- Post Content card -->
          <div class="p-6">
            <p class="text-gray-600 mb-3 text-sm italic ">
              Danh mục : <span class="font-medium text-white bg-[#4B6BFB] rounded-md p-[4px]">{{ post.category }}</span>
            </p>
            <p class="text-gray-700 mb-3 text-sm">
              Tác giả: {{ username }}
            </p>
            <!-- Clickable Post Title -->
            <router-link :to="`/blogpost/${key}`" class="block">
              <h5 class="text-2xl font-semibold text-gray-800 mb-4 hover:text-blue-600 transition duration-200">
                {{ post.title }}
              </h5>
            </router-link>


            <!-- Content Preview -->
            <p class="text-gray-700 mb-6 text-sm">
              {{ truncateContent(post.content) }}...
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center justify-between mt-6 space-y-2 sm:space-y-0">
              <router-link :to="`/blogpost/${key}`"
                class="flex-1 sm:flex-none text-center px-3 py-2 bg-cyan-400 font-bold text-white rounded-lg hover:bg-cyan-500 transition duration-300 ease-in-out">
                Xem Chi Tiết
              </router-link>

              <router-link :to="`/editpost/${key}`"
                class="flex-1 sm:flex-none text-center px-3 py-2 bg-yellow-500 font-bold text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out">
                Chỉnh Sửa
              </router-link>

              <button @click="deletePost(key)"
                class="flex-1 sm:flex-none text-center px-3 py-2 bg-red-500 font-bold text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
                Xóa
              </button>
            </div>



          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      posts: {}
    }
  },
  created() {
    this.loadPosts();
    const username = localStorage.getItem('username');
    if (username) {
      this.isLoggedIn = true;
      this.username = username; // Set username
    }
  },
  methods: {
    loadPosts() {
      this.posts = Object.keys(localStorage)
        .filter(key => key.startsWith('post_'))
        .reduce((acc, key) => {
          try {
            acc[key] = JSON.parse(localStorage.getItem(key))
            return acc
          } catch (e) {
            console.error(`Error parsing post ${key}:`, e)
            return acc
          }
        }, {})
    },

    truncateContent(content) {
      // Loại bỏ thẻ HTML và cắt chuỗi xuống 100 ký tự
      const plainText = content.replace(/<[^>]*>/g, '')
      return plainText.length > 32
        ? plainText.substring(0, 32)
        : plainText
    },

    deletePost(key) {
      if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        localStorage.removeItem(key)
        this.loadPosts()
      }
    }
  }
}
</script>