class Alba {
  // constructor
  constructor ({
    el = '#app',
    data = {},
    mounted = () => {},
    methods = {}
  }) {
    this.el = el
    this.mounted = mounted
    this.data = onChange(data, (e) => this.change(e))
    Object.keys(methods).map(key => {
      this[key] = methods[key]
    })
    
    this.afors = []

    this.buildDOM()
    this.mounted(this)
  }

  // function for build/update dom
  buildDOM () {
    if (this.el) {
      const main = document.querySelector(this.el)
      if (main) {
        this.manageAFor(main)
        this.manageClick(main)
        this.manageAModel(main)

      } else {
        console.warn(`None element found for selector ${this.el}`)
      }
    }
  }

  manageAModel (main) {
    const aModels = main.querySelectorAll('[a-model]')

    if (aModels) {
      aModels.forEach(model => {

        let attribute = model.getAttribute('a-model')

        attribute = attribute.split('.')
        let trueAttrubute = this.data
        
        attribute.map((attr, key) => {
          if (trueAttrubute.hasOwnProperty(attr)) {
            if (key < attribute.length - 1)
            trueAttrubute = trueAttrubute[attr]
          }
        })

        attribute = attribute[attribute.length - 1]

        if (model.value.length === 0) {
          model.value = trueAttrubute[attribute]
        }

        model.addEventListener('keyup', (e) => {
          trueAttrubute[attribute] = e.target.value
        })
      })
    }
  }

  manageClick (main) {
    const clicks = main.querySelectorAll('[a-on-click]')

    if (clicks) {
      clicks.forEach(click => {
        const methodsName = click.getAttribute('a-on-click')

        if (methodsName && this[methodsName]) {
          click.addEventListener('click', () => { this[methodsName](this) });
        }
      })
    }
  }

  change (e) {
    this.afors.map(afor => {
      const divToReplace = document.querySelector(`#${afor.id}`)
      const aforNode = document.createElement('div')
      aforNode.innerHTML = afor.html

      const divFor = document.createElement('div')
      divFor.id = afor.id

      if (divFor) {

        this.replaceVariables(divFor, afor.attribute, afor.childAttribute, aforNode)

        divToReplace.parentNode.replaceChild(divFor, divToReplace)
      }
    })

    this.manageAModel(document.querySelector(this.el))
  }

  manageAFor (main) {
    const afors = main.querySelectorAll('[a-for]')

    if (afors) {
      afors.forEach(afor => {
        const divFor = document.createElement('div')
        const id = `id-${Date.now()}`
    
        divFor.id = id
    
        const attr = afor.getAttribute('a-for')
    
        if (attr) {
          const values = attr.split(' in ')
          if (values.length === 2) {
            const childAttribute = values[0]
            const attribute = values[1]
    
            this.replaceVariables(divFor, attribute, childAttribute, afor)
    
            afor.parentNode.replaceChild(divFor, afor)
            this.afors.push({
              id,
              html: afor.innerHTML,
              childAttribute,
              attribute
            })
          } else {
            console.warn('an a-for are bad formated !')
          }
        }
      })
    }
  }

  replaceVariables (newDiv, attributeName, childAttribute, parent) {
    if (childAttribute && attributeName && this.data[attributeName]) {
      const attribute = this.data[attributeName]
      if (typeof attribute === 'object') {
        const regex = /\{\{(.*?)\.(.*?)\}\}/gim
        console.log('attributes', attribute)
        Object.keys(attribute).map(key => {
          const child = parent.cloneNode(true)
          const variablesToReplace = []

          child.removeAttribute('a-for')
          const variables = child.innerHTML.match(regex)

          if (variables) {
            variables.map(variable => {
              let trueVariable = variable.replace('{{', '').replace('}}', '').trim()
  
              if (trueVariable.indexOf(childAttribute) !== -1) {
                trueVariable = trueVariable.split('.')
                let value = attribute[key]
  
                trueVariable.map(val => {
                  if (val !== childAttribute && value[val]) {
                    value = value[val]
                  }
                })
  
                variablesToReplace.push({
                  selector: variable,
                  replaceBy: value
                })
              }
            })
          }

          variablesToReplace.map(replace => {
            child.innerHTML = child.innerHTML.replace(replace.selector, replace.replaceBy)
          })

          const aModels = child.querySelectorAll('[a-model]')
          console.log('aModels', aModels)
          if (aModels) {
            aModels.forEach(model => {
              const attr = model.getAttribute('a-model')
              if (attr) {
                model.setAttribute('a-model', attr.replace(childAttribute, `${attributeName}.${key}`))
              }
            })
          }

          newDiv.append(child)
        })

      } else {
        console.warn(`Data ${attribute} is not an object ! is ${typeof attribute}`)
      }
    } else {
      console.warn('an a-for are bad formated 2 !')
    }
  }
}

function onChange (object, callback) {
	const handler = {
		get(target, property, receiver) {
			try {
				return new Proxy(target[property], handler);
			} catch (err) {
				return Reflect.get(target, property, receiver);
			}
		},
		defineProperty(target, property, descriptor) {
      const res = Reflect.defineProperty(target, property, descriptor);
			callback();
			return res;
		},
		deleteProperty(target, property) {
      const res = Reflect.deleteProperty(target, property);
      callback();
			return res;
		}
	};

	return new Proxy(object, handler);
};