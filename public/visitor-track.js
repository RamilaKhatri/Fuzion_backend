// Visitor tracking - include on public frontend
// <script src="https://your-backend.com/visitor-track.js"></script>
(function(){
  try{
    var API = (window.__FUZION_API_BASE__ || "") + "/api/visitors/track";
    // use relative if same origin
    if(!window.__FUZION_API_BASE__) API = "/api/visitors/track";
    var key="fuzion_visitor_id";
    var vid=localStorage.getItem(key);
    if(!vid){
      vid=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2));
      localStorage.setItem(key, vid);
    }
    fetch(API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ visitorId: vid, page: location.pathname + location.search }),
      keepalive:true
    }).catch(function(){});
  }catch(_){}
})();
