module.exports = {
  compile: {
    files: [{
      expand: true,
      cwd: 'app/styles',
      src: ['**/*.{scss,sass}', '!**/_*.{scss,sass}', '../../vendor/bootstrap-sass/vendor/**/*.{scss,sass}'],
      dest: 'tmp/result/assets/',
      ext: '.css'
    }]
  }
};
