/*global Ext:false, Config:false, openerplib:false */

Ext.define('Fpos.core.Printer', {
    requires: ['Fpos.store.CategoryStore',
               'Fpos.store.ProductStore',
               'Ext.ux.Deferred'],
    
    config : {
        profile: null,
        timeout: 2000,
        queueSize: 50     
    },
    
    constructor: function(config) {
        this.initConfig(config);
        this.productStore = Ext.StoreMgr.lookup("ProductStore");
        this.queue = [];
        this.active = false;
    },
    
    updateProfile: function(profile, oldProfile) {
        var self = this;
        self.hasCategories = false;
        self.categories = {};
        if ( profile ) {
            if ( profile.pos_category_ids && profile.pos_category_ids.length > 0) {
                Ext.each(profile.pos_category_ids, function(categoryId) {
                    self.categories[categoryId] = true;  
                    self.hasCategories = true;
                });
            }
        }
    },
    
    isProductAllowed: function(productId) {
        var product = this.productStore.getProductById(productId);
        if ( product ) {
            if ( this.hasCategories ) {
                var pos_categ_id = product.get('pos_categ_id');
                if ( !pos_categ_id || !this.categories[pos_categ_id] ) {
                    return false;
                }          
            } 
            return true;
        } 
        return false;
    },
    
    isAvailable: function() {
        return !this.getProfile().local || Config.hasPrinter();
    },
       
    /**
     * @private
     */ 
    remotePrint: function(html, callback) {
        openerplib.json_rpc(this.getProfile().name, "printHtml", [html], callback, { timeout: this.getTimeout() });
    },
    
    /**
     * @private
     */
    handleNext: function(timeout) {
        var self = this;
        if ( !self.active ) {
            self.active = true;
            setTimeout(function() {
                self.active = false;
                self.printQueue(); 
            }, timeout || 0);            
        }
    },
    
    /**
     * @private
     */
    retry: function() {
        this.handleNext(this.getTimeout()*2);
    },
    
    /**
     * @private
     */
    printQueue: function() {
        var self = this;
        if ( self.queue.length > 0 ) {
            var html = self.queue[0];
            self.remotePrint(html, function(err) {
                if (err) {
                    // on errer queue 
                    // again, but wait a while
                    self.retry();
                } else {
                    // remove element and print
                    // again immediatly if there are
                    // one more element
                    self.queue.shift();
                    if ( self.queue.length > 0 ) {
                        self.handleNext();
                    }
                }
            });
        }
    },
    
    printHtml: function(html) {
        var self = this;
        var deferred = Ext.create('Ext.ux.Deferred');
        if ( self.getProfile().local ) {
            setTimeout(function() {
               Config.printHtml(html);
               deferred.resolve();
            },0);        
        } else {
            // if queue started, print into queue
            if ( self.queue.length > 0 ) {
                // enque
                setTimeout(function() {                    
                    // check max queue size
                    if ( self.queue.length > self.getQueueSize() ) {
                        // reject error
                        deferred.reject({name: 'queue_full', message: 'Print queue is full!'});
                    } else {
                        // handle next 
                        self.queue.push(html);
                        self.handleNext();
                        // finished                    
                        deferred.resolve();    
                    }
                });                
            } else {
                // otherwise print directly
                self.remotePrint(html, function(err) {
                    if ( err ) {
                        // retry
                        self.queue.push(html);
                        self.retry();
                        // reject error                                          
                        deferred.reject(err);
                    } else {
                        // finished
                        deferred.resolve();
                    }
                });
            }
        }
        return deferred.promise();
    }
});
