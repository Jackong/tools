<<<<<<< HEAD
#BAE开发环境：
##修改bae_build为:
nodejs_build()
{
        user_code=$1
        domain=$2

        nodejs_code=$app_code"/nodejsapp"
        #使用软链方式，结合supervisor可以直接热部署
        if [ ! -d "$nodejs_code" ]
        then
                ln -s "$user_code" "$nodejs_code"
        fi

        gen_lua $nodejs_code"/app.conf" $nodejs_code"/bae_app_conf.lua"

	    #禁止每次都删除node_modules，可以更快启动
        #rm -rf $nodejs_code"/node_modules"
        cd $nodejs_code
        /home/admin/runtime/node/bin/npm install
        cd -
        chown bae:bae -R $nodejs_code
}
##使用supervisor及开发环境模式
        1.npm config set registry http://registry.npmjs.org/
        2.npm install -g supervisor
        3.
        nodejs)
                nodejs_build $user_code $domain
                sed -i "s/node server.js/DEVELOPMENT=1 supervisor server.js/" $user_code/package.json
                bae_run nodejs start
                sleep 1
                sed -i "s/DEVELOPMENT=1 supervisor server.js/node server.js/" $user_code/package.json
                ;;

##bae app publish --local升级后不可用，则使用：
bae_build nodejs /home/vagrant/iwomen iwomen.duapp.com

#docker开发环境
参考（For Mac）：https://www.dockboard.org/boot2docker-together-with-virtualbox-guest-additions/
=======
tools
=====

tools for services
>>>>>>> 54438106c58f283aca8afcd5910c56a45885067f
