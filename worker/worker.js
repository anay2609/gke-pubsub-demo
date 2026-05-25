const {PubSub}=require(

'@google-cloud/pubsub'

)

const pubsub=new PubSub({

keyFilename:

'/app/key/gke-demo-project.json'

})

const sub=

pubsub.subscription(

'orders-sub'

)

console.log(

'Worker Started'

)

sub.on(

'message',

m=>{

console.log(

'Received:',

m.data.toString()

)

m.ack()

})
