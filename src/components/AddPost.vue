<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="p-4 border rounded-lg bg-gray-50">
      <h2 class="mb-4 text-2xl font-bold text-blue-600 text-center">Tạo Bài Viết Mới</h2>
      <form @submit.prevent="validateAndShowModal">
        <!-- Tiêu đề -->
        <div class="mb-3">
          <label for="postTitle" class="block mb-2">Tiêu Đề</label>
          <input type="text" id="postTitle" v-model="postTitle"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>

        <!-- Toolbar -->
        <div class="mb-3 space-x-2">
          <button v-for="(tool, index) in toolbar" :key="index" type="button" @click="formatText(tool.command)"
            class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            {{ tool.label }}
          </button>

        </div>

        <!-- Nội dung -->
        <div class="mb-3">
          <label for="postContent" class="block mb-2">Nội Dung</label>
          <div ref="contentEditable" contenteditable="true"
            class="w-full h-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
        </div>

        <!-- Upload ảnh -->
        <div class="mb-3">
          <label for="postImage" class="block mb-2">Thêm Ảnh</label>
          <input type="file" id="postImage" @change="handleImageUpload" accept="image/*"
            class="w-full px-3 py-2 border rounded-lg">
        </div>

        <!-- Danh mục -->
        <div class="mb-3">
          <label for="postCategory" class="block mb-2">Chọn Danh Mục</label>
          <select v-model="selectedCategory" class="w-full px-3 py-2 border rounded-lg">
            <option v-for="category in categories" :key="category.value" :value="category.value">
              {{ category.label }}
            </option>
          </select>
        </div>

        <!-- Người đăng -->
        <div class="flex items-center">
          <label for="" class="mr-1">Người đăng: </label>
          <p class="text-blue-600 mr-4">{{ username }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex space-x-2 mt-6">
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold">
            Đăng
          </button>
          <router-link to="/" class=" px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-bold ">
            Quay lại
          </router-link>
        </div>
      </form>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h4 class="text-xl font-bold mb-4">Đăng bài viết?</h4>
        <div class="flex justify-end space-x-2">
          <button @click="addPost" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Ok
          </button>
          <button @click="showModal = false" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AddPost',
  data() {
    return {
      username: '',
      postTitle: '',
      selectedCategory: 'Cong nghe',
      imageFile: null,
      showModal: false,
      toolbar: [
        { label: 'In đậm', command: 'bold' },
        { label: 'In nghiêng', command: 'italic' },
        { label: 'Gạch chân', command: 'underline' },
      ],
      categories: [
        { value: 'Cong nghe', label: 'Danh mục cn' },
        { value: 'Giai tri', label: 'Danh mục gt' },
        { value: 'The gioi', label: 'Danh mục tg' },
      ],
    };
  },
  // created() {
  //   const username = localStorage.getItem('username');
  //   if (username) {
  //     this.username = username;
  //   }
  // },
  created() {
    // Lấy thông tin người dùng từ localStorage
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      this.currentUser = storedUser; // Không cần JSON.parse do username là chuỗi
    } else {
      alert("Bạn chưa đăng nhập! Chuyển hướng về trang chủ.");
      this.$router.push({ name: "Home" });
    }
  },


  methods: {
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      const hours = String(d.getHours()).padStart(2, "0");
      const minu = String(d.getMinutes()).padStart(2, "0");

      return `Ngày ${day} Tháng ${month} năm 20${year} | Vào lúc ${hours} giờ ${minu} phút`;
    },
    
    formatText(command) {
      this.$refs.contentEditable.focus();
      document.execCommand(command, false, null);
    },

    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
    },

    validateAndShowModal() {
      const title = this.postTitle.trim();
      const content = this.$refs.contentEditable.innerText.trim();

      if (!title) {
        alert('Vui lòng nhập Tiêu Đề!');
        return;
      }
      if (!content) {
        alert('Vui lòng nhập Nội Dung!');
        return;
      }

      this.showModal = true;
    },

    async addPost() {
      const postData = {
        title: this.postTitle,
        content: this.$refs.contentEditable.innerHTML,
        category: this.selectedCategory,
        author: this.currentUser,
        date: this.formatDate(new Date().toISOString()), 
        comments: []
      };

      if (this.imageFile) {
        try {
          const base64Image = await this.getBase64(this.imageFile);
          postData.image = base64Image;
        } catch (error) {
          console.error('Error converting image:', error);
        }
      }

      localStorage.setItem(`post_${Date.now()}`, JSON.stringify(postData));
      this.$router.push('/post');
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
  }
}
</script>
<!-- <script>
export default {
  name: 'AddPost',
  data() {
    return {
      username: '',
      postTitle: '',
      selectedCategory: 'Cong nghe',
      imageFile: null,
      showModal: false,
      toolbar: [
        { label: 'In đậm', command: 'bold' },
        { label: 'In nghiêng', command: 'italic' },
        { label: 'Gạch chân', command: 'underline' },
        // { label: 'Danh sách', command: 'insertUnorderedList' },
        // { label: 'Danh sách số', command: 'insertOrderedList' },
      ],
      categories: [
        { value: 'Cong nghe', label: 'Danh mục cn' },
        { value: 'Giai tri', label: 'Danh mục gt' },
        { value: 'The gioi', label: 'Danh mục tg' },
      ],
    };
  },
  created() {
    const username = localStorage.getItem('username');
    if (username) {
      this.username = username; // Set username
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
      const year = String(d.getFullYear()).slice(-2);
      const hours = String(d.getHours()).padStart(2, "0");
      const minu = String(d.getMinutes()).padStart(2, "0");

      return `Ngày ${day} Tháng ${month} năm 20${year} | Vào lúc ${hours} giờ ${minu} phút`   ;
    },
    
    formatText(command) {
      // su dung tool
      this.$refs.contentEditable.focus();
      document.execCommand(command, false, null);
    },

    handleImageUpload(event) {
      this.imageFile = event.target.files[0]
    },

    validateAndShowModal() {
      const title = this.postTitle.trim()
      const content = this.$refs.contentEditable.innerText.trim()

      if (!title) {
        alert('Vui lòng nhập Tiêu Đề!')
        return
      }
      if (!content) {
        alert('Vui lòng nhập Nội Dung!')
        return
      }

      this.showModal = true
    },

    async addPost() {
      const postData = {
        title: this.postTitle,
        content: this.$refs.contentEditable.innerHTML,
        category: this.selectedCategory,
        date: this.formatDate(new Date().toISOString()), 
      }

      if (this.imageFile) {
        try {
          const base64Image = await this.getBase64(this.imageFile)
          postData.image = base64Image
        } catch (error) {
          console.error('Error converting image:', error)
        }
      }

      // Lưu vào localStorage
      localStorage.setItem(`post_${Date.now()}`, JSON.stringify(postData))

      // Chuyển hướng về trang chủ
      this.$router.push('/post')
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }
  }
}
</script> -->


<style scoped>
[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  color: gray;
  font-style: italic;
}
</style>