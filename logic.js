// Компонент "Контакты" - основной блок контактов
const Contacts = {
    data() {
        return {
            newContactData: "",
            /* Для сохранения списка контактов используется локальное хранилище localStorage */
            contacts: JSON.parse(localStorage.getItem('contacts')) || [],
            /* История реализована списком, в который при изменении основного списка добавляюется его прошлая версия.
            При откате основной список принимает значение последнего элемента списка истории, а тот удаляется. */
            history: [],
        }
    },
    methods: {
        // Добавление контакта
        addContact: function () {
            if (this.newContactData.length > 0) {
                this.history.push(this.contacts.slice(0));
                this.prevContacts = this.contacts;
                this.contacts.push({ id: this.contacts.length, name: this.newContactData });
                localStorage.setItem('contacts', JSON.stringify(this.contacts));
            }
        },
        // Удаление контакта
        delContact: function (id) {
            this.history.push(this.contacts.slice(0));
            this.contacts.splice(id, 1);
            localStorage.setItem('contacts', JSON.stringify(this.contacts));
        },
        // Откат действий
        prevState: function () {
            if (this.history.length !== 0) {
                this.contacts = this.history.pop().slice(0);
                localStorage.setItem('contacts', JSON.stringify(this.contacts));
            }
        }
    },
    template:
        `<div>
            <h3 class="header">Список контактов</h3>
            <input class="contact__input" v-model="newContactData" type="text" required placeholder="Введите название...">
            <button class="btn" v-on:click="addContact" type="button">Добавить</button>
            <button class="btn" v-on:click="prevState" type="button">Откатить</button>
            <contact @del_contact="delContact(index)" :data="contacts" v-for="(contacts, index) in contacts" :key="index"></contact>
        </div>`
}

//Компонент "Контакт" - элмент списка контактов
Vue.component("contact", {
    props: ["data"],
    data() {
        return {
            massageText: '',
            dellCounter: 0,
        }
    },
    methods: {
        delContact: function () {
            if (this.dellCounter > 0) {
                this.massageText = "";
                this.dellCounter = 0;
                this.$emit('del_contact');
            }
            else {
                this.massageText = "Вы уверены? Нажимете еще раз, что бы удалить.";
                this.dellCounter++;
            }
        }
    },
    template:
        `<div class="contact">
            <button class="dellContact__button" v-on:click="delContact" type="button">✕</button>
            <router-link :to="'/' + data.name"><p class="contact__name"> {{data.name}} </p></router-link>
            <p class="massage">{{this.massageText}}</p>
        </div>`
});

//Компонент "Контактная информация" - основной блок информации контакта
const ContactInfo = {
    data() {
        return {
            name: '',
            value: '',
            /* Для сохранения списка контактов используется локальное хранилище localStorage */
            contactInfoItems: JSON.parse(localStorage.getItem(this.$route.params.id)) || [],
            /* История реализована списком, в который при изменении основного списка добавляюется его прошлая версия.
            При откате основной список принимает значение последнего элемента списка истории, а тот удаляется. */
            history: [],
        }
    },
    methods: {
        // Добавление полей
        addItem: function () {
            if (this.name.length > 0 && this.value.length > 0) {
                this.history.push(this.contactInfoItems.slice(0));
                this.contactInfoItems.push({ id: this.contactInfoItems.length, name: this.name, value: this.value });
                localStorage.setItem(this.$route.params.id, JSON.stringify(this.contactInfoItems));
                console.log(this.contactInfoItems);
            }
        },
        // Удаление полей
        delItem: function (id) {
            this.history.push(this.contactInfoItems.slice(0));
            this.contactInfoItems.splice(id, 1);
            localStorage.setItem(this.$route.params.id, JSON.stringify(this.contactInfoItems));
        },
        // Изменение полей
        changeItem: function (value) {
            this.history.push(this.contactInfoItems.slice(0));
            // value содержит данные, переданные из дочернего компонента "contactInfoItem"
            let newItem = { id: value.id, name: value.newName, value: value.newValue };
            this.contactInfoItems = this.contactInfoItems.map(item => {
                if (item.id === newItem.id) {
                    return newItem;
                }
                return item;
            })
            localStorage.setItem(this.$route.params.id, JSON.stringify(this.contactInfoItems));
        },
        // Откат действий
        prevState: function () {
            if (this.history.length !== 0) {
                this.contactInfoItems = this.history.pop().slice(0);
                localStorage.setItem(this.$route.params.id, JSON.stringify(this.contactInfoItems));
            }
        }
    },
    template:
        `
        <div>
            <h3>Контакт {{$route.params.id}} </h3>
            <input class="contact__input" v-model="name" type="text" required placeholder="Введите название...">
            <input class="contact__input mgt" v-model="value" type="text" required placeholder="Введите значение...">
            <button class="btn" v-on:click="addItem" type="button">Добавить</button>
            <button class="btn" v-on:click="prevState" type="button">Откатить</button>
            <router-link class="back__link" to="/">Вернуться</router-link>
            <contactInfoItem @del_item="delItem(index)" @change_item="changeItem" :data="contactInfoItems"
                v-for="(contactInfoItems, index) in contactInfoItems" :key="index"></contactInfoItem>
        </div>
        `
}

// Компонент "Элемент контактной информации", элемент списка контактной информации.
Vue.component("contactInfoItem", {
    props: ["data"],
    data() {
        return {
            massageText: '',
            dellCounter: 0,
            changeCounter: 0,
            cancelCounter: 0,
            changeShow: false,
            newName: '',
            newValue: ''
        }
    },
    methods: {
        // Удаление элемента
        delItem: function () {
            if (this.dellCounter > 0) {
                this.massageText = "";
                this.dellCounter = 0;
                this.$emit('del_item');
            }
            else {
                this.massageText = "Вы уверены? Нажимете еще раз, что бы удалить.";
                this.dellCounter++;
            }
        },
        // Отмена изменения элемента
        cancelChange: function () {
            if (this.cancelCounter > 0) {
                this.massageText = "";
                this.cancelCounter = 0;
                this.newName = '';
                this.newValue = '';
                this.changeShow = false;
            }
            else {
                this.massageText = "Вы уверены? Нажимете еще раз, что бы отменить.";
                this.cancelCounter++;
            }
        },
        // Изменение элемента
        changeItem: function () {
            if (this.changeCounter > 0) {
                this.massageText = "";
                this.changeCounter = 0;
                // Отправка данных в материнский компонент
                this.$emit('change_item', { id: this.data.id, newName: this.newName, newValue: this.newValue });
                this.changeShow = false;
            }
            else {
                this.massageText = "Вы уверены? Нажимете еще раз, что бы изменить.";
                this.changeCounter++;
            }
        },
        // Переключатель видимости меню изменений
        showChangeMenu: function () {
            this.changeShow = true;
        },
    },
    template:
        `<div class="contact">
            <button class="dellContact__button" v-on:click="delItem" type="button">✕</button>
            <button class="dellContact__button" v-on:click="showChangeMenu" type="button">↻</button>
            <p class="contact__name">{{data.name}}:{{data.value}} </p>
            <div v-if="changeShow">
                <p>Изменить  </p>
                <input class="contact__input" v-model="newName" value="newName" type="text" required>
                <input class="contact__input mgt" v-model="newValue" value="newValue" type="text" required>
                <button class="btn" v-on:click="changeItem" type="button">Изменить</button>
                <button class="btn" v-on:click="cancelChange" type="button">Отменить</button>
            </div>
            <p class="massage">{{this.massageText}}</p>
        </div>`
});

// Создание экземляра маршрутизатора и передача опций
const router = new VueRouter({
    routes: [
        { path: '/', component: Contacts },
        { path: '/:id', component: ContactInfo },
    ]
})

// Создание и монтирование корневого экземпляра приложения
var app = new Vue({
    el: "#app",
    router
})