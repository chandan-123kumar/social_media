# High level block diagram 

https://github.com/chandan-123kumar/social_media/blob/main/social-media/report/diagram-and-discussion/block_diagram.png

- Used Queue in our project as we need to handle large volume of events and these events can be fired from multiple client Node server will keep listening to the queue.

- To improve the perormance of analytics query did few things
Added indexing in the modals
```
const post = new mongoose.Schema({
    post_id: { type: String, required: true, unique: true },
    post_content: { type: String, required: true},
    user_id: { type: String, required: true }, // Reference to the user who made the post
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    shares_count: { type: Number, default: 0 }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Index on post_id for quick retrieval
// Index on  updatedAt for quick retrieval based on timestam used to fetch popular post in past timerange(minute, hour, day)
post.index({ post_id: 1 });
post.index({ updatedAt: 1 });

```

```
const event = new mongoose.Schema({
    event_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    event_type: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed }
 }, {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);
// indexing on updatedAt helps to calculate active user in last time range(i.e minute, hour, day)
event.index({ updatedAt: 1 });
```
