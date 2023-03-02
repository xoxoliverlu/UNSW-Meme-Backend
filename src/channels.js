function channelsCreateV1(authUserId, name, isPublic) {
        const data = getData();
        let userKeys = Object.keys(data.users);
        let channelNames = Object.keys(data.channels);
        let validUser = false;
        let memberEmail = {};
        
        // Check that the length of name is more than 1 or less than 20 characters
        for (const user of userKeys) {  
          if (data.users[user].authUserId === authUserId) {
            validUser = true;
            memberEmail = data.users[user];
          }
        }
        if (validUser === false) {
          return {
            error: 'User is not valid'
          }
        }
        if (name.length < 1) {
          return {
            error: 'channel name is too short'
          }
        }  
        if (name.length > 20) {
          return {
            error: 'channel name is too long'
          }
        }
        
        // Check for any duplicate names
        for (const channel of channelNames) {
          if (name === channel) {
            return {
              error: 'Channel name already exists'
            }
          }
        }
      
        let cId = channelNames.length;
      
        // Assign information to the new channel
        data.channels[name] = {
          channelId: cId, 
          isPublic: isPublic,
          allMembers: [memberEmail],
          ownerMembers: [memberEmail]
        };
      
        setData(data);
        return {
          channelId:  data.channels[name].channelId
        }
 // Provides an array of all channels (and their associated details)
// that the authorised user is part of.
      }  
      
     
      
