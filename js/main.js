new Alba({
	el: '#app',
	mounted: (el) => {
		el.loadList(el)
	},
	data: {
		proverbs: [],
		newValue: ''
	},
	methods:{
		deleteProverb (el, id) {
			if (id !== null && id !== undefined) {
				return new Promise(async resolve => {
					try {
						await fetch(`service.php?action=delete&id=${id}`, {
							credentials: 'same-origin',
						})

						el.loadList(el)
						resolve(true)
					} catch (error) {
						console.error('[main:methods.deleteProverb]')
						resolve(false)
					}
				})
			}
		},
		addProverb (el) {
			if (el.data.newValue && el.data.newValue.length > 0) {
				return new Promise(async resolve => {
					try {
						await fetch(`service.php?action=add&value=${el.data.newValue}`, {
							credentials: 'same-origin',
						})

						el.data.newValue = ''
						el.loadList(el)

						resolve(true)
					} catch (error) {
						console.error('[main:methods.addProverb]')
						resolve(false)
					}
				})
			}
		},
		loadList (el) {
			return new Promise(async resolve => {
				try {
					const response = await fetch('service.php?action=list', {
						credentials: 'same-origin',
					})
					
					if (response) {
						el.data.proverbs = await response.json()
						resolve(true)
					}

					resolve(false)
				} catch (error) {
					console.error('[main:methods.deleteProverb]')
					resolve(false)
				}
			})
		}
	}
})
