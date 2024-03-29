define( [ "qlik", "text!./style.css"
],
function ( qlik) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	
	return {
		
		definition: {
			type: "items",
			component: "accordion",
			items: {
				titleBackground : {
					label: "Title styling",
					items: {
						background:{
							component: "color-picker",
							ref: "qDef.backgroundColor",
							label: "Background color",
							type: "object",
							show: true,
							defaultValue: {
								color: "ffffff",
								index: "-1"
							}	
						},
						fontColor:{
							component: "color-picker",
							ref: "qDef.Color",
							label: "Font Color",
							type: "object",
							show: true,
							defaultValue: {
								color: "000000",
								index: "-2"
							}
						},
						fontstyle:{
							component: "string",
							ref: "qDef.fontStyle",
							label: "Font Style",
							type: "string",
							show: true
						}
					}		
				},
				about : {
					label: "About",
					items : {
						content: {
							component :"text",
							label : "Title Styling object can be used to style (background color, font color and font style) title bar of the charts used in the current sheet."
						}
						
					}
				}
			}
		},

		support : {
			snapshot: false,
			export: false,
			exportData : false
		},
		paint: async function ($element, layout) {
			//add your rendering code here	
			//following code show the extension object in edit mode and hide the object in analysis mode
			
			let objectDisplay = document.querySelector(`div[tid='${this.options.id}']`)
			
			var result = qlik.navigation.getMode();
			
			result === 'analysis' ? objectDisplay.style.display='none' : objectDisplay.style.display='block';		
			
			document.querySelector(`div[tid='${this.options.id}'] header`).style.display='none';

			const currentApp = qlik.currApp(this);
			const currentSheet = qlik.navigation.getCurrentSheetId();

			const sheetSessionObject = await currentApp.model.engineApp.getObject(currentSheet.sheetId);
 
			const currentSheetLayout = await sheetSessionObject.getLayout();

			console.log(currentSheetLayout)
			
			const allObjectsqIds = await Promise.all(currentSheetLayout.cells.map(async (data)=>{
				const obj = await currentApp.model.engineApp.getObject(data.name)
				return obj.getLayout();
			}))

			const objectsWithTitle = allObjectsqIds.filter((data)=>{
				return data.showTitles===true && data.title!==""
			})

			objectsWithTitle.map((obj)=>{
				// Selecting elements using querySelectorAll
				const headers = document.querySelectorAll(`#grid-wrap div[tid='${obj.qInfo.qId}'] header`);

				// Looping through selected elements and applying style
				headers.forEach(header => {
					header.style.backgroundColor = `${layout.qDef.backgroundColor.color}`;
					let intialObjectPadding = parseFloat(window.getComputedStyle(header).paddingLeft);
					
					if(!intialObjectPadding){
						header.style.marginLeft="-10px";
						header.style.width = "110%";
						header.style.paddingLeft = "10px";
					}
					
				});

				// Selecting elements using querySelectorAll
				const headersFont = document.querySelectorAll(`#grid-wrap div[tid='${obj.qInfo.qId}'] header h1, #grid-wrap div[tid] header h2, #grid-wrap div[tid] header h3, #grid-wrap div[tid] header h4, #grid-wrap div[tid] header h5, #grid-wrap div[tid='${obj.qInfo.qId}'] header h6`);

				// Looping through selected elements and applying style
				headersFont.forEach(headerFont => {
					headerFont.style.color = `${layout.qDef.Color.color}`;
					headerFont.style.fontFamily = `${layout.qDef.fontStyle},"Arial"`;					
				});
			});		

			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

