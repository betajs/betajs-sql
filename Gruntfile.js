module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile');
	var dist = 'betajs-sql';

	gruntHelper.init(pkg, grunt)


	/* Compilation */
		.scopedclosurerevisionTask(null, "src/**/*.js", "dist/" + dist + "-noscoped.js", {
			"module": "global:BetaJS.Server.Sql",
			"server": "global:BetaJS.Server",
			"base": "global:BetaJS",
			"data": "global:BetaJS.Data"
		}, {
			"base:version": pkg.devDependencies.betajs,
			"data:version": pkg.devDependencies["betajs-data"]
		})
		.concatTask('concat-scoped', [require.resolve("betajs-scoped"), 'dist/' + dist + '-noscoped.js'], 'dist/' + dist + '.js')
		.uglifyTask('uglify-noscoped', 'dist/' + dist + '-noscoped.js', 'dist/' + dist + '-noscoped.min.js')
		.uglifyTask('uglify-scoped', 'dist/' + dist + '.js', 'dist/' + dist + '.min.js')
		.packageTask()
        .jsbeautifyTask(null, "src/*.js")

		/* Testing */
		.closureTask(null, [require.resolve("betajs-scoped"), require.resolve("betajs"), require.resolve("betajs-data"), require.resolve("betajs-server"), "./dist/betajs-sql-noscoped.js"])
		.lintTask(null, ['./src/**/*.js', './dist/' + dist + '-noscoped.js', './dist/' + dist + '.js', './Gruntfile.js', './tests/**/*.js'])
        .githookTask(null, "pre-commit", "check")

		/* External Configurations */
		.codeclimateTask()

		/* Markdown Files */
		.readmeTask()
		.licenseTask()

		/* Documentation */
		.docsTask();

	grunt.initConfig(gruntHelper.config);

	grunt.registerTask('default', ['package', 'githook', 'readme', 'license', 'codeclimate', 'jsbeautify', 'scopedclosurerevision', 'concat-scoped', 'uglify-noscoped', 'uglify-scoped']);
	grunt.registerTask('check', [ 'lint' ]);

};

