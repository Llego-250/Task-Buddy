<template>
<div class="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-400 p-5">
  <div class="text-center">
    <h1 class="text-white text-4xl font-bold mb-4">TaskBuddy</h1>
    <h2 class="text-white text-xl mx-10 mb-8">Hello Beautiful User❤️, this is the personal task manager</h2>
  </div>

  <div class="flex gap-2 mb-4">
    <input type="text" name="New task" placeholder="new task" class="px-3 py-2 border border-gray-300 rounded-md flex-1">
    <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer">ADD</button>
  </div>
</div>
</template>

<style>
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: Arial, sans-serif;
  margin: 0px;
  background: linear-gradient(rgb(14, 10, 111), rgb(20, 209, 211));
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;

}
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 3.2em;
  line-height: 0.1;
  color: #f1f1f1;
  text-align: center;
}
h2{
  color:#2ed2ff;
  margin: 40px;
}

input {
  padding: 8px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #469cf8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>