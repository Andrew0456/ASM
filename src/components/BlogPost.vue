<template>
  <div>

    <h2 class="px-4 py-6 mx-auto mb-6 text-3xl font-bold text-center text-gray-800 max-w-7xl sm:px-6 lg:px-8">Chi Tiết Bài Viết</h2>

    <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="p-6 bg-white rounded-lg shadow-md">
        <h2 class="mb-3 text-3xl font-bold">{{ post.title }}</h2>
        <p class="mb-4 text-xl text-blue-700">Người đăng: {{ username }}</p>
        <p class="mb-4 italic text-gray-600">Danh mục: {{ post.category }}</p>

        <!-- Image -->
        <div v-if="post.image" class="mb-6">
          <img :src="post.image" :alt="post.title" class="object-fill w-full rounded-lg shadow-lg max-h-196">
        </div>

        <!-- Content -->
        <div class="mb-6 prose max-w-none" v-html="post.content"></div>

        <!-- Like/Unlike Button and Like Count -->
        <div class="flex items-center mb-4">
          <button @click="toggleLike" 
            class="px-3 py-2 text-white transition duration-300 ease-in-out rounded-lg">

    <h2 class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-3xl font-bold mb-6 text-center text-gray-800">Chi Tiết Bài Viết</h2>

    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-3xl font-bold mb-3">{{ post.title }}</h2>
        <p class="text-blue-700 mb-4 text-xl">Người đăng: {{ username }}</p>
        <p class="text-gray-600 mb-4 italic">Danh mục: {{ post.category }}</p>

        <!-- Image -->
        <div v-if="post.image" class="mb-6">
          <img :src="post.image" :alt="post.title" class="w-full max-h-196 object-fill rounded-lg shadow-lg">
        </div>

        <!-- Content -->
        <div class="prose max-w-none mb-6" v-html="post.content"></div>

        <!-- Like/Unlike Button and Like Count -->
        <div class="flex items-center mb-4">
          <button @click="toggleLike" 
            class="px-3 py-2 text-white rounded-lg transition duration-300 ease-in-out">
            <!-- Heart Icon -->
            <i class="fa fa-heart" :class="{'text-red-600': post.isLiked, 'text-gray-500': !post.isLiked}"></i>
          </button>
          <span class="ml-3 text-gray-700">{{ post.likeCount || 0 }} Likes</span>
        </div>
        <hr>
        <!--smtp-->
        <div class="w-100">
          <form ref="form" @submit.prevent="sendEmail">
          <label>Enter your email to receive newest blog</label>
          <input type="email" name="user_email" class="px-3 border border-orange-600 rounded-lg" v-model="user_email">
          <button type="submit" value="Send" class="w-24 py-2 bg-red-500 rounded-lg">Submit</button>
          </form>
        </div>
        
        <!-- <h2>Gửi Email</h2>  
        <form @submit.prevent="sendEmail">  
          <input   
            type="text"   
            v-model="name"   
            placeholder="Tên người nhận"   
            required   
          />  
          <input   
            type="email"   
            v-model="email"   
            placeholder="Email người nhận"   
            required   
          />  
          <textarea   
            v-model="message"   
            placeholder="Nội dung"   
            required   
          ></textarea>  
          <button type="submit">Gửi Email</button>  
        </form>   -->
        
        <!-- Back Button -->
        <router-link 
          to="/home" 
          class="inline-block px-6 py-3 text-white transition duration-300 bg-gray-500 rounded-lg hover:bg-gray-600"


        <!-- Back Button -->
        <router-link 
          to="/home" 
          class="inline-block px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Quay lại Trang Chính
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import emailjs from '@emailjs/browser';  

export default {
  name: 'BlogPost',
  data() {
    return {
      username: '',
      post: null,
      name: '',  
      email: '',  
      message: '',

    };
  },
  created() {
    const key = this.$route.params.key;
    try {
      const postData = localStorage.getItem(key);
      if (postData) {
        this.post = JSON.parse(postData);

        // Ensure `likeCount` and `likedUsers` are properly initialized
        if (!this.post.likedUsers) this.post.likedUsers = [];
        if (this.post.likeCount === undefined) this.post.likeCount = 0;

        // Check if current user has liked the post
        const username = localStorage.getItem('username');
        this.username = username || '';
        this.post.isLiked = this.post.likedUsers.includes(this.username);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài viết:', error);
      this.post = null;
    }
  },
  methods: {
    sendEmail() {
      emailjs
        .sendForm('mailsendvue','template_x21zog4', this.$refs.form, {publicKey :'j3_OvNPh1PtlyZbam'})
        .then(
          () => {
            alert('SUCCESS!');
          },
          (error) => {
            alert('FAILED...', error.text);
          },
        )},
    // sendEmail() {  
    //   const templateParams = {  
    //     name: this.name,  
    //     email: this.email,  
    //     message: this.message,  
    //   };  

    //   emailjs.send('mailsendvue', 'template_x21zog4', templateParams)  
         
    // },  

    toggleLike() {
      if (!this.post || !this.username) return;

      const userIndex = this.post.likedUsers.indexOf(this.username);

      if (userIndex !== -1) {
        // User has already liked, remove the like
        this.post.likeCount -= 1;
        this.post.likedUsers.splice(userIndex, 1);
        this.post.isLiked = false;
      } else {
        // User hasn't liked, add the like
        this.post.likeCount += 1;
        this.post.likedUsers.push(this.username);
        this.post.isLiked = true;
      }

      // Save updated post back to localStorage
      localStorage.setItem(this.$route.params.key, JSON.stringify(this.post));
    },
  },
  head() {
    return {
      title: this.post ? this.post.title : 'Không tìm thấy bài viết',
    };
  },
};
</script>
