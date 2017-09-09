package de.cofinpro.bomber;

import com.github.jedis.lock.JedisLock;
import de.cofinpro.bomber.models.State;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@ApplicationScope
@Component
public class RedisState implements DisposableBean {

    JedisPool pool = new JedisPool(new JedisPoolConfig(), "localhost");

    public State loadState() {
        try (Jedis jedis = pool.getResource()) {
            String data = jedis.get("foo");
        }

        return null;
    }

    public void save(State state) {
        try (Jedis jedis = pool.getResource()) {

            JedisLock lock = new JedisLock(jedis, "lockname", 10000, 30000);
            lock.acquire();
            try {
                jedis.set("foo", "bar");
            }
            finally {
                lock.release();
            }

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void destroy() throws Exception {
        pool.destroy();
    }
}
