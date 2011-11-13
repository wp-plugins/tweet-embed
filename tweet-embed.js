jQuery.fn.twitterise = function() {
	jQuery(this).each(
		function() {
			var url = 'http://api.twitter.com/1/statuses/show.json?id=' + jQuery(this).attr('data-id');
 			var id = jQuery(this).attr('id');
			
			function timeSince(date) {
				var diff = (((new Date()).getTime() - date.getTime()) / 1000);
				var day_diff = Math.floor(diff / 86400);
				
				if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) {
					return date.toLocaleDateString();
				}
				
				return day_diff == 0 && (
					diff < 60 && 'just now' ||
					diff < 120 && '1 minute ago' ||
					diff < 3600 && Math.floor(diff / 60) + ' minutes ago' ||
					diff < 7200 && 'an hour ago' ||
					diff < 86400 && Math.floor(diff / 3600) + ' hours ago'
				) || (
					day_diff == 1 && '1 day ago' ||
					day_diff < 7 && day_diff + ' days ago' ||
					day_diff < 31 && Math.ceil(day_diff / 7) + ' weeks ago'
				);
			}
			
			jQuery.getJSON(url + '&callback=?',
				function(data) {
					var html = '';
					var profile_background_image = data.user.profile_background_image_url;
					var profile_background_colour = data.user.profile_background_color;
					var profile_text_colour = data.user.profile_text_color;
					var profile_link_colour = data.user.profile_link_color;
					var profile_image = data.user.profile_image_url;
					var text = data.text;
					var timestamp = data.created_at;
					var easy_timestamp = timeSince(new Date(timestamp));
					var source = data.source;
					var screen_name = data.user.screen_name;
					var real_name = data.user.name;
					
					text = text.replace(
						/(^|[^\w])(http:\/\/[^\s]+)/i, '$1<a href="$2">$2</a>'
					);
					
					text = text.replace(
						/(^|[^\w])#(\w+)\b/i, '$1<a href="http://twitter.com/search?q=$2">#$2</a>'
					);
					
					text = text.replace(
						/(^|[^\w])@(\w+)\b/i, '$1@<a href="http://twitter.com/$2">$2</a>'
					);
					
					html += '<div style="background: url(\'' + profile_background_image + '\') #' + profile_background_colour + '; padding: 20px; margin: 0 0 0.5em 0; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; line-height: 100%;">';
					html += '<p style="background: #fff; padding: 10px 12px 10px 12px; margin: 0; min-height: 48px; color: #' + profile_link_colour + '; font-size: 18px !important; line-height: 22px !important; -moz-border-radius: 5px; -webkit-border-radius: 5px;">';
					html += '<span style="font-family: Georgia, Palatino, Helvetica Neue, Helvetica, Arial, sans-serif !important;">' + text + '</span>';
					html += '<span style="font-size: 12px !important; display: block;">';
					html += '<a title="' + timestamp + '" href="' + url + '">' + easy_timestamp + '</a> via ' + source + '</span>';
					html += '<span style="display: block; width: 100%; clear: both; margin-top: 8px; padding-top: 12px; height: 40px; border-top: 1px solid #fff; border-top: 1px solid #e6e6e6;">';
					html += '<span style="line-height: 19px !important;">';
					html += '<a href="http://twitter.com/' + screen_name + '"><img src="' + profile_image + '" style="float: left; margin: 0 7px 0 0px; width: 38px; height: 38px;" /></a>';
					html += '<a href="http://twitter.com/' + screen_name + '" style="color: #' + profile_link_colour + '; text-decoration: none;"><strong>@' + screen_name + '</strong></a><br/>';
					html += '<span style="font-size: 12px;">' + real_name + '</span>';
					html += '</span></span></p></div>';
					
					jQuery('#' + id).html(html);
				}
			);
		}
	);
}

jQuery(document).ready(
	function() {
		jQuery('div.tweet-embed-tweet[data-id]').twitterise();
	}
);