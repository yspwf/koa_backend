module.exports = class productServer {

  getProductById(productId){
    const products = {
      '1': { id: '1', name: 'Product A', price: 20 },
      '2': { id: '2', name: 'Product B', price: 30 },
    };
    return products[productId] || null;    
  }
  
}