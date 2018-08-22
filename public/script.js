var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
  el: '#app',

  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },

  // vue will re-evaluate the function if ever any of the properties changes.
  computed: {
    noMoreItems: function () {
      return this.items.length === this.results.length && this.results.length > 0;
    } 
  },

  methods: {
    appendItems: function () {
      if(this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },

    onSubmit: function () {
      if(this.newSearch.length) {
        this.items = []
        this.loading = true;
        this.$http.get('/search/'.concat(this.newSearch))
        .then(function(res) {
          console.log(res.data)
          this.lastSearch = this.newSearch;
          this.results = res.data;
          this.appendItems();
          this.loading = false;
        });
      }
    },
    addItem: function (index) {
      this.total += PRICE;
      var item = this.items[index];
      var found = false;
      for(var i = 0; i < this.cart.length; i++) {
        if(this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          return;
        }
      }

      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }
    },

    increment: function(item) {
      item.qty++;
      this.total += PRICE;
    },

    decrement: function(item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            return;
          }
        }
      }
    }
  },

  filters: {
    currency: function(price) {
      return '$'.concat(price.toFixed(2));
    }
  },

  mounted: function () {
    this.onSubmit();

    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    var vueInstance = this;
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  }
});

