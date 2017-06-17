<?php
use Symfony\Component\Yaml\Parser;

class PhinxConfig implements ArrayAccess
{
    protected $environment;

    protected $path;

    protected $config;

    public function __construct($path = '', $environment = 'development')
    {
        $this->environment($environment);

        $this->path($path);

        $this->parse();
    }

    protected function config($config = array())
    {
        $this->config = $config;

        return $this;
    }

    public function environment($env = '')
    {
        if (empty($env)) {
            return $this->environment;
        }

        $this->environment = $env;
    }

    public function path($path = '')
    {
        if (empty($path)) {
            return $this->path;
        }

        $this->path = $path;
    }

    public function parse()
    {
        if ($this->path() == '') {

            throw new Exception('Path to config not set.');
        }

        $yaml = new Parser();

        $config = $yaml->parse(file_get_contents($this->path()));

        $this->config($config['environments'][$this->environment()]);
    }

    public function offsetExists($offset)
    {
        return array_key_exists($offset, $this->config);
    }

    public function offsetGet($offset)
    {
        return $this->config[$offset];
    }

    public function offsetSet($offset, $value)
    {
        $this->config[$offset] = $value;
    }

    public function offsetUnset($offset)
    {
        unset($this->config[$offset]);
    }

}