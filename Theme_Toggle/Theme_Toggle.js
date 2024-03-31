define(["qlik", "text!./template.html", "text!./style.css"],
	function (qlik, template, cssContent) {
		'use strict';
		$("<style>").html(cssContent).appendTo("head");
		return {
			template: template,
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					MyDropdownProp: {
						type: "items",
						label: "Available Themes",
						items: {
							initialTheme: {
								type: "string",
								component: "dropdown",
								label: "First Theme",
								ref: "qDef.initialTheme",
								options: async function () {
									const qthemes = await qlik.getThemeList();
									return qthemes.map((data) => {
										return {
											value: data.id,
											label: data.name
										}
									})
								}
							},
							finalTheme: {
								type: "string",
								component: "dropdown",
								label: "Second Theme",
								ref: "qDef.finalTheme",
								options: async function () {
									const qthemes = await qlik.getThemeList();
									return qthemes.map((data) => {
										return {
											value: data.id,
											label: data.name
										}
									})
								}
							}
						}
					},
					settings: {
						uses: "settings"
					}
				}
			},

			paint: function ($element, layout) {
				return qlik.Promise.resolve();
			},

			controller: ['$scope', function ($scope) {
				(async () => {
					const currApp = qlik.currApp(this);
					const objectQid = $scope.options.id;

					const currTheme = await currApp.theme.get()

					const currThemeId = currTheme.id
					if(currThemeId==$scope.layout.qDef.finalTheme){
						document.querySelector(`#theme-toggle-${objectQid}`).checked=true;
						document.querySelector(`#toggle-btn-${objectQid}`).classList.add('toggle-btn-switch')
					}

					console.log(currThemeId)

					$scope.switchTheme = async function () {
						
						const toggleSwitch = document.querySelector(`#theme-toggle-${objectQid}`)
						const toggleBtn = document.querySelector(`#toggle-btn-${objectQid}`)

						toggleBtn.classList.toggle('toggle-btn-switch')
						if (toggleSwitch.checked) {
							qlik.theme.apply($scope.layout.qDef.finalTheme)
							currApp.theme.save($scope.layout.qDef.finalTheme)

						} else {
							qlik.theme.apply($scope.layout.qDef.initialTheme)
							currApp.theme.save($scope.layout.qDef.initialTheme)
						}
					}
					console.log(document.querySelector(`#theme-toggle-${objectQid}`).checked)
				})()
			}]
		};

	});