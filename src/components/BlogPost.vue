<template>
  <div>

    <!-- <h2 class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-3xl font-bold mb-6 text-center text-gray-800">Chi Tiết Bài Viết</h2> -->
    <h2 class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-3xl font-bold  text-center text-cyan-400">Chi Tiết Bài Viết</h2>


    
    <h2 class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-3xl font-bold mb-6 text-center text-gray-800">Chi Tiết Bài Viết</h2>

    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-3xl font-bold mb-3">{{ post.title }}</h2>
        <p class="text-gray-700 mb-4 text-xl">Người đăng: <i class="fa fa-user fa-fw text-cyan-400" aria-hidden="true"></i><b class="text-cyan-500">{{ username }} </b>    </p>
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
          class="inline-block px-6 py-3 text-white transition duration-300 bg-gray-500 rounded-lg hover:bg-gray-600"/>


        <!-- Back Button -->
        <router-link 
          to="/home" 
          class="inline-block px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Quay lại Trang Chính
        </router-link>


        
        <p class="mb-8 text-3xl font-bold mt-36 text-sky-500">What do you think about this post?</p>
      <form @submit.prevent="postComment">
        <div class="mb-3"> <textarea v-model="newComment"
            class="w-full pt-5 pb-5 mb-5 bg-rose-200 rounded-lg shadow-md h-18 ps-10 pe-5 text-slate-950" rows="4"
            placeholder="Write your comment..." required></textarea> </div> <button type="submit"
          class="px-2 py-1 mb-8 font-semibold bg-red-300 rounded-lg"> Submit </button>
        <p class="mb-5 text-2xl font-semibold">Comments: </p>
        <hr />
      </form>
      <div v-if="comments.length > 0" class="pt-3 pb-3 mt-4 mb-4 rounded-md shadow-md bg-slate-100 ps-5 pe-5">
        <ul class="mb-3 list-items">
          <li v-for="(comment, index) in comments" :key="index" class="mb-5">
            <div> <strong>{{ comment.username }}:</strong> {{ comment.text }} <br /> <small class="text-slate-400">{{
              comment.timestamp }}</small> </div>
          </li>
        </ul>
      </div>
      <div v-else
        class="p-5 pt-3 pb-3 mt-4 mb-4 text-2xl font-medium text-center rounded-md shadow-md bg-slate-100 ps-5 pe-5"> No
        comment yet </div>

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

      newComment: '',
      comments: []

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
        this.comments = this.post.comments || [];


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
    postComment() {
      if (!this.username) {
        alert('Please login first!');
        this.$router.push('/');
        return;
      }
//thoi gian
      const timestamp = new Date().toLocaleString();
      const newCommentObj = {
        username: this.username,
        text: this.newComment,
        timestamp: timestamp
      };

      //comment
      this.comments.push(newCommentObj);
      this.post.comments = this.comments;
      localStorage.setItem(this.$route.params.key, JSON.stringify(this.post));
      this.newComment = '';
    },
  },
  head() {
    return {
      title: this.post ? this.post.title : 'Không tìm thấy bài viết',
    };
  },
};
</script>
