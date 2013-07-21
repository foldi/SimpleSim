module.exports = function(grunt) {

  var name, latest, bannerContent, bannerContentMin, footerContent,
      devRelease, minRelease, publicRelease, lDevRelease, lMinRelease;

  latest = '<%= pkg.name %>';
  name = '<%= pkg.name %>-v<%= pkg.version%>';

  bannerContent = '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> \n' +
                  ' *  <%= pkg.author.name %> \n' +
                  ' *  <%= pkg.author.address %> \n' +
                  ' *  <%= pkg.author.email %> \n' +
                  ' *  <%= pkg.author.twitter %> \n' +
                  ' *  License: <%= pkg.license %> */\n\n' +
                  'var ' + latest + ' = {}, exports = ' + latest + ';\n\n' +
                  '(function(exports) {\n\n' +
                  '"use strict";\n\n';

  bannerContentMin = '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> \n' +
                  '<%= pkg.author.name %> |' +
                  '<%= pkg.author.address %> | ' +
                  '<%= pkg.author.email %> | ' +
                  '<%= pkg.author.twitter %> | ' +
                  'License: <%= pkg.license %> */\n';

  footerContent = '\n}(exports));';

  devRelease = 'release/' + name + '.js';
  minRelease = 'release/' + name + '.min.js';

  lDevRelease = 'release/' + latest + '.js';
  lMinRelease = 'release/' + latest + '.min.js';
  publicRelease = 'public/scripts/' + latest + '.min.js';

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      target: {
        src: ['src/**/*.js']
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      lax: {
        options: {
          import: false
        },
        src: ['css/*.css']
      }
    },
    cssmin: {
      addBanner: {
        options: {
          banner: bannerContentMin
        },
        src: ['css/*.css'],
        dest: 'release/' + name + '.min.css'
      }
    },
    concat: {
      options: {
        banner: bannerContent,
        footer: footerContent,
        stripBanners: true,
        process: function(src, filepath) {
          if (filepath === 'src/raf.js') {
            return src;
          } else {
            var className = filepath.replace('src/', ''). replace('.js', '');
            return src + '\nexports.' + className + ' = ' + className + ';\n';
          }
        }
      },
      target: {
        src: ['src/*.js'],
        dest: 'release/' + name + '.js'
      }
    },
    uglify: {
      options: {
        banner: bannerContentMin,
        wrap: 'SimpleSim',
        exportAll: true
      },
      target: {
        src: ['src/*.js'],
        dest: 'release/' + name + '.min.js'
      }
    },
    copy: {
      development: { // copy non-minified release file
        src: devRelease,
        dest: lDevRelease
      },
      minified: { // copy minified release file
        src: minRelease,
        dest: lMinRelease
      },
      css: {
        src: 'release/' + name + '.min.css',
        dest: 'release/' + latest + '.min.css'
      },
      public: { // copy non-minified file
        src: lMinRelease,
        dest: publicRelease
      },
      publicCSS: {
        src: 'release/' + name + '.min.css',
        dest: 'public/css/' + latest + '.min.css'
      }
    },
    watch: {
      files: ['src/*.js'],
      tasks: ['jshint'],
    },
    jasmine: {
      src: 'src/*.js',
      options: {
        version: '1.3.0',
        specs: 'specs/*.js'
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['jshint', 'cssmin', 'jasmine', 'concat', 'uglify', 'copy']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
};

