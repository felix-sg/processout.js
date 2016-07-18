/// <reference path="../references.ts" />

/**
 * ProcessOut module/namespace
 */
module ProcessOut {

    /**
     * ProcessOut Invoice class
     */
    export class Invoice {

        /**
         * ProcessOut instance
         * @type {ProcessOut}
         */
        protected instance: ProcessOut;

        /**
         * UID of the invoice
         * @type {ProcessOut}
         */
        protected uid: string;

        /**
         * Raw data of the invoice gathered from the ProcessOut API
         * @type {Object}
         */
        data: Object;

        /**
         * List of the available gateways for the invoice
         * @type {Gateways.Gateway[]}
         */
        protected gatewaysList: Gateways.Gateway[];

        /**
         * Invoice constructor
         */
        constructor(instance: ProcessOut) {
            this.instance = instance;
        }

        /**
         * Find the requested invoice by its UID
         * @param {string} uid
         * @param {callback} success
         * @param {callback} error
         */
        find(uid: string, success: (invoice: Invoice) => void,
            error: (err: Error) => void) {

            var t = this;

            t.uid = uid;
            t.instance.apiRequest("get", `/invoices/${uid}`, {},
            function(data, code, jqxhr) {
                t.data = data;

                t.instance.apiRequest("get", `/invoices/${uid}/gateways`, {},
                function(data, code, jqxhr) {
                    t.gatewaysList = [];
                    for (var i = 0; i < data.gateways.length; i++) {
                        t.gatewaysList[i] = Gateways.Handler.buildGateway(
                            t.instance, data.gateways[i], `/invoices/${uid}`,
                            Flow.OneOff);
                    }

                    success(t);
                }, function() {
                    error(<Error>{
                        code: ErrorCode.ResourceNotFound,
                        message: "The invoice's gateways could not be fetched."
                    });
                });
            }, function() {
                error(<Error>{
                    code: ErrorCode.ResourceNotFound,
                    message: "The invoice could not be found."
                });
            });
        }

        /**
         * Get the available gateways list for this invoice
         * @return {Gateways.Gateway[]}
         */
        gateways(): Gateways.Gateway[] {
            return this.gatewaysList;
        }

    }

}
