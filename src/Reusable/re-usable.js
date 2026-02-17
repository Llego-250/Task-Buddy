// Export all reusable components
import Button from './Button.vue'
import Card from './Card.vue'
import Input from './Input.vue'
import Badge from './Badge.vue'
import Modal from './Modal.vue'
import Checkbox from './Checkbox.vue'
import Select from './Select.vue'
import CreateButton from './create.js'

export {
  Button,
  Card,
  Input,
  Badge,
  Modal,
  Checkbox,
  Select,
  CreateButton
}

// Plugin for global registration
export default {
  install(app) {
    app.component('Button', Button)
    app.component('Card', Card)
    app.component('Input', Input)
    app.component('Badge', Badge)
    app.component('Modal', Modal)
    app.component('Checkbox', Checkbox)
    app.component('Select', Select)
    app.component('CreateButton', CreateButton)
  }
}
