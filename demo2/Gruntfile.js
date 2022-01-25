module.exports = function(grunt) {

  grunt.initConfig({
    meta: {
      name: 'Nancy test'
    },
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: '\n'
      },
      dist: {
        // the files to concatenate
        src: ['src/**/*.js'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',  
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        },
        '-W032': true
      }
    },
    // 多任务必须配置
    log: {
      foo: [1, 2, 3],
      bar: 'hello world',
      baz: false
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  /** 基本自定义任务 */
  // !! 基本任务无需配置
  // 执行 grunt foo 打印 foo, no args
  // 执行 grunt foo:arg1 打印 foo, arg1 undefined
  // 执行 grunt foo:arg1:arg2 打印 foo, arg1 arg2
  grunt.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
    if (arguments.length === 0) {
      grunt.log.writeln(this.name + ", no args");
    } else {
      grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
    }
  });
  /** 多任务 */
  // !! 多任务必须在配置,否则报错
  // >> No "log" targets found.
  // Warning: Task "log" failed. Use --force to continue.
  // Aborted due to warnings.
  grunt.registerMultiTask('log', 'Log stuff.', function() {
    // 执行 grunt log:foo, 打印 foo: 1,2,3
    // 执行 grunt log:bar, 打印 bar: hello world
    grunt.log.writeln(this.target + ': ' + this.data);
  });
  /** 找不到任务名 */
  // 执行 grunt fo
  // 报错
  // Warning: Task "fo" not found. Use --force to continue.
  // Aborted due to warnings.
  /** 在任务内部调用其他任务 */
  grunt.registerTask('custom1', function () {
    // grunt.task.run('custom');
    // 或
    // grunt.task.run('concat', 'jshint');
    // 或
    grunt.task.run(['concat', 'jshint']); // 这个写法与上面的那种写法一致
  });
  /** 异步任务 */
  grunt.registerTask('custom2', function() {
    // 需要这一行告知 grunt 这是 async 模式并返回 done 方法
    var done = this.async();
    // Run some sync stuff.
    grunt.log.writeln('Processing task...');
    // And some async stuff.
    setTimeout(function() {
      grunt.log.writeln('All done!');
      done();
    }, 2000);
  });
  /** 任务出错 */
  // 任务出错，返回 false 后续任务都会被终止，除非指定 --force
  // 不返回或返回其他值都没事
  grunt.registerTask('a1', function() {
    grunt.log.writeln('执行 a1');
    return false;
  });
  grunt.registerTask('a11', function () {
    var done = this.async();
    setTimeout(function () {
      console.log('执行 a11');
      done(0);
    });
  });
  grunt.registerTask('a2', function() {
    grunt.log.writeln('执行 a2');
    return true;
  });
  grunt.registerTask('a', ['a1', 'a11', 'a2']);
  /** 依赖于其他任务成功执行 */
  grunt.registerTask('b1', function() {
    grunt.task.requires('a11');
    grunt.log.writeln('执行 b1');
    return true;
  });
  grunt.registerTask('b', ['a11', 'b1']);
  /** 依赖于属性 */
  grunt.registerTask('c1', function() {
    // grunt.config.requires('meta.name1');
    grunt.config.requires(['meta', 'name']); // 这两种写法是相同的
    grunt.log.writeln('执行 c1');
    return true;
  });
  /** 访问属性 */
  grunt.registerTask('d1', function() {
    grunt.log.writeln('执行 d1', grunt.config('meta'));
    grunt.log.writeln('执行 d1 name1', grunt.config('meta.name1'));
    grunt.log.writeln('执行 d1 name', grunt.config(['meta', 'name']));
    return true;
  });
  /** 任务别名 */
  // 定义 default 任务别名，执行 default 就是依次执行后面列表中的任务
  // default 可以不传 直接执行 grunt
  grunt.registerTask('default', ['concat', 'uglify', 'jshint']);
  // 执行 grunt custom
  grunt.registerTask('custom', ['concat', 'uglify', 'jshint']);
  // 可以执行 grunt concat 只执行 concat 任务
};